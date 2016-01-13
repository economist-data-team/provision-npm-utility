#!/usr/bin/env node
import { runProvisionerSet } from 'packagesmith';
import jsonFile from 'packagesmith.formats.json';
import sortPackageJson from 'sort-package-json';
import getObjectPath from 'lodash.get';
import without from 'lodash.without';
export function provisionLegacyRemoval() {
  return {

    'package.json': {
      after: 'npm prune',
      contents: jsonFile((packageJson) => {
        Reflect.deleteProperty(packageJson, 'component-devserver');
        Reflect.deleteProperty(packageJson, 'devpack-doc');
        if (packageJson.scripts) {
          Reflect.deleteProperty(packageJson.scripts, 'preinstall');
          Reflect.deleteProperty(packageJson.scripts, 'postinstall');
          Reflect.deleteProperty(packageJson.scripts, 'serve');
          Reflect.deleteProperty(packageJson.scripts, 'prepublish:watch');
          Reflect.deleteProperty(packageJson.scripts, 'test:base');
          Reflect.deleteProperty(packageJson.scripts, 'doc:watch');
          Reflect.deleteProperty(packageJson.scripts, 'doc:js:watch');
          Reflect.deleteProperty(packageJson.scripts, 'doc:css:watch');
          Reflect.deleteProperty(packageJson.scripts, 'doc:html:watch');
          Reflect.deleteProperty(packageJson.scripts, 'doc:html:watch');
        }
        if (packageJson.devDependencies) {
          Reflect.deleteProperty(packageJson.devDependencies, '@economist/component-devpack');
          Reflect.deleteProperty(packageJson.devDependencies, '@economist/component-devserver');
          Reflect.deleteProperty(packageJson.devDependencies, '@economist/component-testharness');
          Reflect.deleteProperty(packageJson.devDependencies, 'parallelshell');
          Reflect.deleteProperty(packageJson.devDependencies, 'eslint-plugin-one-variable-per-var');
          Reflect.deleteProperty(packageJson.devDependencies, 'minifyify');
          Reflect.deleteProperty(packageJson.devDependencies, 'postcss');
          Reflect.deleteProperty(packageJson.devDependencies, 'react');
          Reflect.deleteProperty(packageJson.devDependencies, 'chai-things');
          Reflect.deleteProperty(packageJson.devDependencies, 'cssnext');
        }
        if (packageJson.config) {
          Reflect.deleteProperty(packageJson.config, 'lint_opts');
          Reflect.deleteProperty(packageJson.config, 'testbundle_opts');
          Reflect.deleteProperty(packageJson.config, 'ghpages_files');
        }
        packageJson.files = without(packageJson.files || [], [
          '*.js',
          '*.es6',
          '*.css',
          '!karma.conf.js',
          '!testbundle.js',
        ]);
        const build = getObjectPath(packageJson, 'scripts.build');
        if (build && build !== 'npm-run-all --parallel build:*') {
          Reflect.deleteProperty(packageJson.scripts, 'build');
          packageJson.scripts['build:LEGACY-RENAME-THIS'] = build;
        }
        return sortPackageJson(packageJson);
      }),
    },

  };
}
export default provisionLegacyRemoval;
if (require.main === module) {
  runProvisionerSet(process.argv[2] || process.cwd(), provisionLegacyRemoval());
}
