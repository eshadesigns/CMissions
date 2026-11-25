/**
 * Parse a JSON object printed by a C++ program.
 *
 * This is a small helper for a future agreed-upon C++/spacecraft output
 * protocol. It does not validate mission commands or change spacecraft state.
 * The program must print one JSON object to stdout with no extra text around it.
 *
 * @param {string} stdout Standard output returned by executeCpp().
 * @returns {object} Parsed JSON object.
 */
export function parseCppJsonOutput(stdout) {
  if (typeof stdout !== 'string' || !stdout.trim()) {
    throw new TypeError('C++ program did not produce JSON output');
  }

  let output;

  try {
    output = JSON.parse(stdout);
  } catch {
    throw new SyntaxError('C++ program output must be valid JSON');
  }

  if (output === null || typeof output !== 'object' || Array.isArray(output)) {
    throw new TypeError('C++ program output must be a JSON object');
  }

  return output;
}
