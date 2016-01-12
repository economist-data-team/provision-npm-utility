#!/usr/bin/env node
import { runProvisionerSet } from 'packagesmith';
import jsonFile from 'packagesmith.formats.json';
import nameQuestion from 'packagesmith.questions.name';
import descriptionQuestion from 'packagesmith.questions.description';
import parsePackageJsonName from 'parse-packagejson-name';
import sortPackageJson from 'sort-package-json';
import defaultsDeep from 'lodash.defaultsdeep';
import kebabCase from 'lodash.kebabcase';
import moduleJson from '../package.json';
export function provisionPackageJson() {
  return {
    'package.json': {
      questions: [ nameQuestion(), descriptionQuestion() ],
      contents: jsonFile((packageJson, answers) => {
        const parsedPackageName = {
          ...parsePackageJsonName(answers.name || packageJson),
          scope: 'economist',
        };
        const packageName = `component-${kebabCase(parsedPackageName.fullName.replace(/^component-/, ''))}`;
        let bugsUrl = `http://github.com/economist-components/${packageName}/issues`;
        if (typeof packageJson.bugs === 'string') {
          bugsUrl = packageJson.bugs;
          Reflect.deleteProperty(packageJson, 'bugs');
        }
        return sortPackageJson(defaultsDeep({
          name: `@${parsedPackageName.scope}/${packageName}`,
          description: answers.description,
          homepage: `http://github.com/economist-components/${packageName}`,
          bugs: { url: bugsUrl },
          scripts: {
            'prebuild:css': 'mkdir -p $npm_package_directories_lib',
            'build:css': 'cp $npm_package_directories_src/*.css $npm_package_directories_lib',
            start: 'npm run watch',
            watch: 'npm-run-all --parallel watch:*',
            prepublish: 'npm run build',
            build: 'npm-run-all --parallel build:*',
            provision: 'provision-react-component',
            lint: 'npm-run-all --parallel lint:*',
          },
          devDependencies: {
            '@economist/provision-react-component': moduleJson.version,
          },
        }, packageJson));
      }),
    },
  };
}
export default provisionPackageJson;
if (require.main === module) {
  runProvisionerSet(process.argv[2] || process.cwd(), provisionPackageJson());
}
