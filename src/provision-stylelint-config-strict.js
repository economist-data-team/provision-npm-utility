#!/usr/bin/env node
import { runProvisionerSet } from 'packagesmith';
import jsonFile from 'packagesmith.formats.json';
import sortPackageJson from 'sort-package-json';
import defaultsDeep from 'lodash.defaultsdeep';
import unique from 'lodash.uniq';
import getObjectPath from 'lodash.get';
export function provisionEslintConfigStrict() {
  return {
    'package.json': {
      after: 'npm install',
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        stylelint: {
          extends: unique([
            ...getObjectPath(packageJson, 'stylelint.extends', []),
            'stylelint-config-strict',
          ]),
        },
        devDependencies: {
          'stylelint': '^3.2.0',
          'stylelint-config-strict': '^1.0.0',
        },
        config: {
          lint: {
            css: {
              options: getObjectPath(packageJson, 'config.lint.css.options', ''),
            },
          },
          ghooks: {
            'pre-commit': 'npm run lint',
          },
        },
        scripts: {
          pretest: 'npm run lint',
          lint: 'npm-run-all --parallel lint:*',
          'lint:css': 'stylelint $npm_package_config_lint_css_options $npm_package_directories_src/*.css',
        },
      }, packageJson))),
    },
  };
}
export default provisionEslintConfigStrict;
if (require.main === module) {
  runProvisionerSet(process.argv[2] || process.cwd(), provisionEslintConfigStrict());
}
