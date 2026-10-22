// Added by Sydney

const DEFAULT_API_URL = 'https://ce.judge0.com';
const DEFAULT_LANGUAGE_ID = 54;
const MAX_SOURCE_LENGTH = 100_000;

/**
 * Execute C++ through a Judge0-compatible API.
 *
 * @param {object} options
 * @param {string} options.sourceCode C++ source code
 * @param {object} [options.inputSnapshot] Mission state supplied as JSON stdin
 * @param {Function} [options.fetchImpl] Injectable fetch for testing
 * @param {string} [options.apiUrl] Execution API base URL
 * @param {string} [options.apiKey] Optional API authentication token
 * @returns {Promise<object>} Normalized execution result
 */
export async function executeCpp({
  sourceCode,
  inputSnapshot,
  fetchImpl = fetch,
  apiUrl = process.env.JUDGE0_API_URL || DEFAULT_API_URL,
  apiKey = process.env.JUDGE0_API_KEY,
} = {}) {
  if (typeof sourceCode !== 'string' || !sourceCode.trim()) {
    throw new TypeError('sourceCode must be a non-empty string');
  }

  if (sourceCode.length > MAX_SOURCE_LENGTH) {
    throw new RangeError(
      `sourceCode must not exceed ${MAX_SOURCE_LENGTH} characters`
    );
  }

  if (
    inputSnapshot !== undefined &&
    (inputSnapshot === null ||
      typeof inputSnapshot !== 'object' ||
      Array.isArray(inputSnapshot))
  ) {
    throw new TypeError('inputSnapshot must be an object when provided');
  }

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
    language_id: DEFAULT_LANGUAGE_ID,
    source_code: Buffer.from(sourceCode, 'utf8').toString('base64'),
    stdin:
      inputSnapshot === undefined
        ? ''
        : Buffer.from(JSON.stringify(inputSnapshot), 'utf8').toString('base64'),
    cpu_time_limit: 2,
    wall_time_limit: 5,
    memory_limit: 128000,
  };

  let response;

  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    throw new Error(`C++ execution service request failed: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(
      `C++ execution service returned HTTP ${response.status}`
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error('C++ execution service returned invalid JSON');
  }

  // Judge0 returns encoded output fields when base64_encoded=true.
  const decode = (value) =>
    value ? Buffer.from(value, 'base64').toString('utf8') : '';

  const status = result.status?.description ?? 'Unknown';
  const statusId = result.status?.id ?? null;

  return {
    status,
    statusId,
    ok: statusId === 3 && result.exit_code === 0,
    stdout: decode(result.stdout),
    stderr: decode(result.stderr),
    compileOutput: decode(result.compile_output),
    exitCode: result.exit_code ?? null,
    time: result.time ?? null,
    memory: result.memory ?? null,
  };
}
