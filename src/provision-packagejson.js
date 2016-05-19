#!/usr/bin/env node
import defaultsDeep from 'lodash.defaultsdeep';
import descriptionQuestion from 'packagesmith.questions.description';
import jsonFile from 'packagesmith.formats.json';
import kebabCase from 'lodash.kebabcase';
// import moduleJson from '../package.json';
import nameQuestion from 'packagesmith.questions.name';
import packageVersions from '../package-versions';
import parsePackageJsonName from 'parse-packagejson-name';
import { runProvisionerSet } from 'packagesmith';
import sortPackageJson from 'sort-package-json';
export function provisionPackageJson() {
  return {
    'package.json': {
      questions: [ nameQuestion(), descriptionQuestion() ],
      contents: jsonFile((packageJson, answers) => {
        const parsedPackageName = {
          ...parsePackageJsonName(answers.name || packageJson),
          scope: 'economist',
        };
        const packageName = `utility-${ kebabCase(parsedPackageName.fullName.replace(/^utility-/, '')) }`;
        let bugsUrl = `https://github.com/economist-data-team/${ packageName }/issues`;
        if (typeof packageJson.bugs === 'string') {
          bugsUrl = packageJson.bugs;
          Reflect.deleteProperty(packageJson, 'bugs');
        }
        return sortPackageJson(defaultsDeep({
          name: `@${ parsedPackageName.scope }/${ packageName }`,
          license: 'MIT',
          description: answers.description,
          homepage: `https://github.com/economist-data-team/${ packageName }`,
          bugs: { url: bugsUrl },
          config: {
            ghooks: {
              'pre-commit': 'npm run lint',
            },
          },
          scripts: {
            'access': 'npm-run-all --parallel access:*',
            'access:public': 'npm access public $npm_package_name',
            'access:sudo': 'npm access grant read-write economist:read-write-all $npm_package_name',
            'build': 'npm-run-all --parallel build:*',
            'build:js': 'babel $npm_package_directories_src -d $npm_package_directories_lib --source-maps inline',
            'provision': 'provision-npm-utility',
            'prepublish': 'npm run build',
            'postpublish': 'npm run access',
            'semantic-release': 'semantic-release pre || exit 0; npm publish && semantic-release post',
            'start': 'npm run watch',
            'pretest': 'npm run lint',
            'lint': 'npm-run-all --parallel lint:*',
            'lint:js': 'eslint --ignore-path .gitignore .',
            'watch': 'npm-run-all --parallel watch:*',
            'watch:js': 'karma start --singleRun=false',
          },
          devDependencies: {
            'eslint-plugin-filenames': packageVersions['eslint-plugin-filenames'],
            'eslint-plugin-react': packageVersions['eslint-plugin-react'],
            'live-server': packageVersions['live-server'],
            'npm-run-all': packageVersions['npm-run-all'],
            'npm-assets': packageVersions['npm-assets'],
          },
        }, packageJson));
      }),
    },
  };
}
export default provisionPackageJson;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionPackageJson());
}
