module.exports = {
  bail: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['<rootDir>/src/**/__tests__/*.test.js'],
  testEnvironment: 'node',
};
