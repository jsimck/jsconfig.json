import fs from 'fs';
import {
  templateParser,
  extractTemplate,
  DependencyTemplateMap
} from '../templateParser';

describe('DependencyTemplateMap', () => {
  it('should match snapshot', () => {
    expect(DependencyTemplateMap).toMatchSnapshot();
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
    ['nextjs', { next: '16.x' }],
    ['nextjs', { next: '16.x', axios: '*', fetch: '^1.2.3' }],
    ['react', { react: '16.x' }],
    [
      'react',
      { '@ima/core': '17.x', 'react-dom': '17.x', 'react-scripts': '^1.2.3' }
    ],
    ['react', { react: '17.x', 'react-dom': '17.x', 'react-scripts': '^1.2.3' }]
  ])(
    'should return "%s" template for %j dependencies',
    (template, dependencies) => {
      expect(extractTemplate({ dependencies })).toBe(template);
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
