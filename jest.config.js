module.exports = {
  verbose: true,
  bail: true,
  coverageThreshold: {
    global: {
      branches: 80,
      lines: 80,
      statements: -10,
    },
  },
};
