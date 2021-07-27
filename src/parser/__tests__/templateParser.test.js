const fs = require('fs');
const {
  templateParser,
  extractTemplate,
  TemplateComparisonMap,
  comparePkgJson
} = require('../templateParser');

describe('TemplateComparisonMap', () => {
  it('should match snapshot', () => {
    expect(TemplateComparisonMap).toMatchSnapshot();
  });
});

describe('comparePkgJson()', () => {
  it('should return null', () => {
    expect(comparePkgJson()).toBeNull();
    expect(comparePkgJson({})).toBeNull();
    expect(comparePkgJson(null, {})).toBeNull();
    expect(comparePkgJson('', false)).toBeNull();
    expect(comparePkgJson([])).toBeNull();
  });

  it('should return null for no matches', () => {
    expect(
      comparePkgJson(
        { dependencies: { next: '16.x' } },
        { dependencies: ['react', 'react-dom', 'react-scripts'] }
      )
    ).toBeNull();

    expect(
      comparePkgJson(
        { devDependencies: { react: '16.x' } },
        { dependencies: ['react', 'react-dom', 'react-scripts'] }
      )
    ).toBeNull();

    expect(
      comparePkgJson(
        { name: 'test-package', description: 'test-description' },
        { dependencies: ['react', 'react-dom', 'react-scripts'] }
      )
    ).toBeNull();
  });

  it('should return true for found matches', () => {
    expect(
      comparePkgJson(
        {
          name: 'test-package',
          description: 'test-description',
          dependencies: { react: '16.x' }
        },
        { dependencies: ['react', 'react-dom', 'react-scripts'] }
      )
    ).toBeTruthy();
  });
});

describe('extractTemplate()', () => {
  it('should return null for package.json without dependencies', () => {
    expect(extractTemplate({})).toBeNull();
    expect(extractTemplate(null)).toBeNull();
    expect(extractTemplate(undefined)).toBeNull();
    expect(extractTemplate({ name: 'package-name' })).toBeNull();
    expect(extractTemplate({ devDependencies: { react: '16.x' } })).toBeNull();
  });

  it.each([
    ['nextjs', { dependencies: { next: '16.x' } }],
    ['nextjs', { dependencies: { next: '16.x', axios: '*', fetch: '^1.2.3' } }],
    ['react', { dependencies: { react: '16.x' } }],
    [
      'react',
      {
        dependencies: {
          '@ima/core': '17.x',
          'react-dom': '17.x',
          'react-scripts': '^1.2.3'
        }
      }
    ],
    [
      'react',
      {
        dependencies: {
          react: '17.x',
          'react-dom': '17.x',
          'react-scripts': '^1.2.3'
        }
      }
    ],
    [
      'vuejs',
      {
        devDependencies: {
          poi: '*',
          tyu: '*'
        }
      }
    ]
  ])(
    'should return "%s" template for %j dependencies',
    (template, comparisonObj) => {
      expect(extractTemplate(comparisonObj)).toBe(template);
    }
  );

  it('should return null for unmatched dependencies', () => {
    expect(
      extractTemplate({
        dependencies: {
          '@ima/core': '17.x',
          '@ima/plugin-atoms': '17.x'
        }
      })
    ).toBeNull();

    expect(
      extractTemplate({
        devDependencies: {
          react: '17.x'
        },
        dependencies: {
          axios: '*'
        }
      })
    ).toBeNull();
  });
});

describe('templateParser()', () => {
  let baseConfig = {
    params: {
      cwd: './'
    },
    config: {
      compilerOptions: {
        baseUrl: './',
        paths: {
          '@library/*': ['./=>lib/core/index.es5/*']
        }
      }
    }
  };

  it('should return input args if package.json does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(await templateParser(baseConfig)).toStrictEqual(baseConfig);
  });
});
