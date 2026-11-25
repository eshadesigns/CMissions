import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCpp } from '../src/services/cpp-execution.js';

function mockResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

test('rejects empty C++ source without making a request', async () => {
  let called = false;

  await assert.rejects(
    executeCpp({
      sourceCode: '   ',
      fetchImpl: async () => {
        called = true;
      },
    }),
    /non-empty string/
  );

  assert.equal(called, false);
});

test('rejects source code that exceeds the size limit', async () => {
  await assert.rejects(
    executeCpp({ sourceCode: 'a'.repeat(100_001), fetchImpl: async () => {} }),
    /must not exceed/
  );
});

test('rejects an invalid spacecraft input snapshot', async () => {
  await assert.rejects(
    executeCpp({ sourceCode: 'int main() {}', inputSnapshot: [], fetchImpl: async () => {} }),
    /inputSnapshot must be an object/
  );
});

test('submits C++ and returns decoded output', async () => {
  let requestUrl;
  let requestOptions;

  const fetchImpl = async (url, options) => {
    requestUrl = url;
    requestOptions = options;

    return mockResponse({
      status: { id: 3, description: 'Accepted' },
      stdout: Buffer.from('Hello CMissions!\n').toString('base64'),
      stderr: null,
      compile_output: null,
      exit_code: 0,
      time: '0.01',
      memory: 2048,
    });
  };

  const result = await executeCpp({
    sourceCode: '#include <iostream>\nint main() { std::cout << "Hello CMissions!\\n"; }',
    inputSnapshot: { batteryVoltage: 10.5 },
    fetchImpl,
    apiUrl: 'https://compiler.example.com/',
  });

  assert.equal(requestUrl.origin, 'https://compiler.example.com');
  assert.equal(requestUrl.pathname, '/submissions');
  assert.equal(requestUrl.searchParams.get('wait'), 'true');
  assert.equal(requestUrl.searchParams.get('base64_encoded'), 'true');
  assert.equal(requestOptions.method, 'POST');

  const body = JSON.parse(requestOptions.body);

  assert.equal(body.language_id, 54);
  assert.equal(
    Buffer.from(body.source_code, 'base64').toString('utf8'),
    '#include <iostream>\nint main() { std::cout << "Hello CMissions!\\n"; }'
  );
  assert.deepEqual(
    JSON.parse(Buffer.from(body.stdin, 'base64').toString('utf8')),
    { batteryVoltage: 10.5 }
  );

  assert.equal(result.ok, true);
  assert.equal(result.status, 'Accepted');
  assert.equal(result.stdout, 'Hello CMissions!\n');
  assert.equal(result.stderr, '');
  assert.equal(result.compileOutput, '');
  assert.equal(result.exitCode, 0);
  assert.equal(result.time, '0.01');
  assert.equal(result.memory, 2048);
});

test('returns compiler diagnostics when compilation fails', async () => {
  const result = await executeCpp({
    sourceCode: 'this is not valid C++',
    fetchImpl: async () =>
      mockResponse({
        status: { id: 6, description: 'Compilation Error' },
        stdout: null,
        stderr: null,
        compile_output: Buffer.from('error: expected declaration').toString('base64'),
        exit_code: null,
      }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 'Compilation Error');
  assert.match(result.compileOutput, /expected declaration/);
});

test('returns runtime failure without marking it as successful', async () => {
  const result = await executeCpp({
    sourceCode: 'int main() { return 1; }',
    fetchImpl: async () =>
      mockResponse({
        status: { id: 3, description: 'Accepted' },
        stdout: null,
        stderr: Buffer.from('program failed').toString('base64'),
        compile_output: null,
        exit_code: 1,
      }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.exitCode, 1);
  assert.equal(result.stderr, 'program failed');
});

test('reports HTTP errors from the execution provider', async () => {
  await assert.rejects(
    executeCpp({
      sourceCode: 'int main() { return 0; }',
      fetchImpl: async () => mockResponse({}, 503),
    }),
    /HTTP 503/
  );
});

test('reports invalid JSON from the execution provider', async () => {
  await assert.rejects(
    executeCpp({
      sourceCode: 'int main() { return 0; }',
      fetchImpl: async () => ({ ok: true, json: async () => { throw new Error('bad json'); } }),
    }),
    /invalid JSON/
  );
});
