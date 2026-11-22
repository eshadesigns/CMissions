const DEFAULT_API_URL = 'https://ce.judge0.com';
const DEFAULT_LANGUAGE_ID = 54; // C++ (GCC 9.2.0) on the standard Judge0 CE language list.
const MAX_SOURCE_LENGTH = 100_000;
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Run student C++ source code through a Judge0-compatible execution API.
 *
 * This function only compiles/runs code and returns the result. It does not
 * parse spacecraft commands, change spacecraft state, or decide mission success.
 *
 * @param {object} options
 * @param {string} options.sourceCode Student's C++ source code.
 * @param {object} [options.inputSnapshot] JSON-serializable data passed to stdin.
 * @param {Function} [options.fetchImpl] Injectable fetch function for tests.
 * @param {string} [options.apiUrl] Judge0 API base URL.
 * @param {string} [options.apiKey] Optional Judge0 authentication token.
 * @returns {Promise<object>} Normalized compiler/execution result.
 */
export async function executeCpp({
  sourceCode,
  inputSnapshot,
  fetchImpl = fetch,
  apiUrl = process.env.JUDGE0_API_URL || DEFAULT_API_URL,
  apiKey = process.env.JUDGE0_API_KEY,
  languageId = Number(process.env.JUDGE0_LANGUAGE_ID || DEFAULT_LANGUAGE_ID),
  cpuTimeLimit = 2,
  wallTimeLimit = 5,
  memoryLimit = 128_000,
} = {}) {
  validateOptions({
    sourceCode,
    inputSnapshot,
    fetchImpl,
    apiUrl,
    apiKey,
    languageId,
    cpuTimeLimit,
    wallTimeLimit,
    memoryLimit,
  });

  const baseUrl = apiUrl.replace(/\/+$/, '');
  const url = new URL(`${baseUrl}/submissions`);
  url.searchParams.set('base64_encoded', 'true');
  url.searchParams.set('wait', 'true');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-Auth-Token'] = apiKey;
  }

  const requestBody = {
    language_id: languageId,
    source_code: encode(sourceCode),
    stdin: inputSnapshot === undefined ? '' : encode(JSON.stringify(inputSnapshot)),
    cpu_time_limit: cpuTimeLimit,
    wall_time_limit: wallTimeLimit,
    memory_limit: memoryLimit,
  };

  let response;

  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(`C++ execution service request failed: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`C++ execution service returned HTTP ${response.status}`);
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error('C++ execution service returned invalid JSON');
  }

  return normalizeResult(result);
}

function validateOptions({
  sourceCode,
  inputSnapshot,
  fetchImpl,
  apiUrl,
  apiKey,
  languageId,
  cpuTimeLimit,
  wallTimeLimit,
  memoryLimit,
}) {
  if (typeof sourceCode !== 'string' || !sourceCode.trim()) {
    throw new TypeError('sourceCode must be a non-empty string');
  }

  if (sourceCode.length > MAX_SOURCE_LENGTH) {
    throw new RangeError(`sourceCode must not exceed ${MAX_SOURCE_LENGTH} characters`);
  }

  if (
    inputSnapshot !== undefined &&
    (inputSnapshot === null || typeof inputSnapshot !== 'object' || Array.isArray(inputSnapshot))
  ) {
    throw new TypeError('inputSnapshot must be an object when provided');
  }

  if (typeof fetchImpl !== 'function') {
    throw new TypeError('fetchImpl must be a function');
  }

  if (typeof apiUrl !== 'string' || !apiUrl.trim()) {
    throw new TypeError('apiUrl must be a non-empty URL string');
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    throw new TypeError('apiUrl must be a valid URL');
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new TypeError('apiUrl must use HTTP or HTTPS');
  }

  if (apiKey !== undefined && typeof apiKey !== 'string') {
    throw new TypeError('apiKey must be a string when provided');
  }

  if (!Number.isInteger(languageId) || languageId <= 0) {
    throw new TypeError('languageId must be a positive integer');
  }

  if (!isPositiveNumber(cpuTimeLimit) || !isPositiveNumber(wallTimeLimit)) {
    throw new TypeError('CPU and wall time limits must be positive numbers');
  }

  if (!Number.isInteger(memoryLimit) || memoryLimit <= 0) {
    throw new TypeError('memoryLimit must be a positive integer');
  }

  // Check that the snapshot can actually be sent as JSON before making a request.
  if (inputSnapshot !== undefined) {
    try {
      const serializedSnapshot = JSON.stringify(inputSnapshot);
      if (typeof serializedSnapshot !== 'string') {
        throw new Error('Snapshot did not serialize to a JSON string');
      }
    } catch {
      throw new TypeError('inputSnapshot must be JSON-serializable');
    }
  }
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function encode(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

function decode(value) {
  return value ? Buffer.from(value, 'base64').toString('utf8') : '';
}

function normalizeResult(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error('C++ execution service returned an invalid result');
  }

  const status = result.status?.description ?? 'Unknown';
  const statusId = result.status?.id ?? null;
  const exitCode = result.exit_code ?? null;

  return {
    ok: statusId === 3 && exitCode === 0,
    status,
    statusId,
    stdout: decode(result.stdout),
    stderr: decode(result.stderr),
    compileOutput: decode(result.compile_output),
    exitCode,
    time: result.time ?? null,
    memory: result.memory ?? null,
  };
}
