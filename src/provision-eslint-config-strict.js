#!/usr/bin/env node
import { runProvisionerSet } from 'packagesmith';
import jsonFile from 'packagesmith.formats.json';
import sortPackageJson from 'sort-package-json';
import defaultsDeep from 'lodash.defaultsdeep';
import getObjectPath from 'lodash.get';
import unique from 'lodash.uniq';
export function provisionEslintConfigStrict() {
  return {
    'package.json': {
      after: 'npm install',
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        eslintConfig: {
          extends: unique([
            ...getObjectPath(packageJson, 'eslintConfig.extends', []),
            'strict',
            'strict-react',
          ]),
        },
        devDependencies: {
          'eslint': '^1.10.3',
          'eslint-config-strict': '^7.0.2',
          'eslint-config-strict-react': '^4.0.0',
          'eslint-plugin-filenames': '^0.2.0',
          'eslint-plugin-react': '^3.11.2',
        },
        config: {
          lint: {
            js: { // eslint-disable-line id-length
              options: getObjectPath(packageJson, 'config.lint.js.options', '--ignore-path .gitignore --fix'),
            },
          },
          ghooks: {
            'pre-commit': 'npm run lint',
          },
        },
        scripts: {
          pretest: 'npm run lint && npm run doc:js',
          lint: 'npm-run-all --parallel lint:*',
          'lint:js': 'eslint $npm_package_config_lint_options $npm_package_directories_src',
        },
      }, packageJson))),
    },
  };
}
export default provisionEslintConfigStrict;
if (require.main === module) {
  runProvisionerSet(process.argv[2] || process.cwd(), provisionEslintConfigStrict());
}
