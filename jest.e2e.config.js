const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['<rootDir>/src/**/__e2e__/**/*.test.js']
};
