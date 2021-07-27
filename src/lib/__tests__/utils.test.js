const { persist } = require('../utils');

jest.spyOn(console, 'log').mockImplementation();

jest.mock('fs');
jest.mock('path', () => ({
  resolve: jest.fn(() => '../../__mocks__/templateMock.json'),
  join: jest.fn((...args) => args)
}));

jest.mock('util', () => ({
  promisify: () => jest.fn((...args) => args)
}));

describe('persist()', () => {
  it('should use cwd from params as base path', async () => {
    expect.assertions(1);

    let result = await persist({
      params: { cwd: '/current/working/directory' }
    });

    expect(result[0]).toStrictEqual([
      '/current/working/directory',
      'jsconfig.json'
    ]);
  });

  it('should deep merge given config with default one', async () => {
    expect.assertions(1);

    let result = await persist(
      {},
      {
        compilerOptions: {
          baseUrl: './src'
        },
        exclude: ['node_modules']
      }
    );

    expect(result[1]).toMatchInlineSnapshot(`
      "{
        \\"compilerOptions\\": {
          \\"checkJs\\": false,
          \\"resolveJsonModule\\": true
        },
        \\"exclude\\": [
          \\"dist\\",
          \\"node_modules\\"
        ]
      }"
    `);
  });
});
