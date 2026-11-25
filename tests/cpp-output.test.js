import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCppJsonOutput } from '../src/services/cpp-output.js';

test('parses a JSON object from C++ stdout', () => {
  const output = parseCppJsonOutput('{"camera":false,"flightComputer":true}');

  assert.deepEqual(output, {
    camera: false,
    flightComputer: true,
  });
});

test('rejects empty output', () => {
  assert.throws(() => parseCppJsonOutput('  '), /did not produce JSON/);
});

test('rejects invalid JSON', () => {
  assert.throws(() => parseCppJsonOutput('camera=false'), /valid JSON/);
});

test('rejects JSON arrays and primitive values', () => {
  assert.throws(() => parseCppJsonOutput('[1, 2, 3]'), /must be a JSON object/);
  assert.throws(() => parseCppJsonOutput('true'), /must be a JSON object/);
  assert.throws(() => parseCppJsonOutput('null'), /must be a JSON object/);
});
