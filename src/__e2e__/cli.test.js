const path = require('path');
const { spawn } = require('child_process');

describe('jsconfig.json CLI test', () => {
  it('should generate basic jsconfig.json', (done) => {
    const cli = spawn('node', [path.resolve(__dirname, '../../dist/cli.js')], {
      stdio: 'inherit',
      cwd: __dirname
    });
  });
});
