#!/usr/bin/env node

import defaultsDeep from 'lodash.defaultsdeep';
import jsonFile from 'packagesmith.formats.json';
import nameQuestion from 'packagesmith.questions.name';
import { packageToClass } from './package-names';
import packageVersions from '../package-versions';
import { readFileSync as readFile } from 'fs';
import { resolve as resolvePath } from 'path';
import { runProvisionerSet } from 'packagesmith';
import sortPackageJson from 'sort-package-json';
import unique from 'lodash.uniq';

const jsonDefaultIndent = 2;
const karmaConf = readFile(resolvePath(__dirname, '../assets/karma.conf.js'), 'utf8');
export function provisionTestFiles() {
  return {

    'karma.conf.js': {
      contents: () => karmaConf,
    },

    'package.json': {
      after: 'npm install',
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        directories: {
          test: 'test',
        },
        devDependencies: {
          'browserify': packageVersions.browserify,
          'watchify': packageVersions.watchify,
          'babelify': packageVersions.babelify,
          'mocha': packageVersions.mocha,
          'chai': packageVersions.chai,
          'chai-spies': packageVersions['chai-spies'],
          'karma': packageVersions.karma,
          'karma-mocha': packageVersions['karma-mocha'],
          'karma-mocha-reporter': packageVersions['karma-mocha-reporter'],
          'karma-phantomjs-launcher': packageVersions['karma-phantomjs-launcher'],
          'karma-browserify': packageVersions['karma-browserify'],
          'karma-coverage': packageVersions['karma-coverage'],
          'browserify-istanbul': packageVersions['browserify-istanbul'],
          'isparta': packageVersions.isparta,
          'phantomjs-prebuilt': packageVersions['phantomjs-prebuilt'],
          'karma-sauce-launcher': packageVersions['karma-sauce-launcher'],
          'babel-polyfill': packageVersions['babel-polyfill'],
        },
        scripts: {
          test: 'karma start',
        },
      }, packageJson))),
    },

    'test/.eslintrc': {
      contents: (contents) => {
        const eslintrc = contents ? JSON.parse(contents) : {};
        return JSON.stringify({
          ...eslintrc,
          extends: unique([
            ...(eslintrc.extends || []),
            'strict',
            'strict/test',
          ]),
        }, null, jsonDefaultIndent);
      },
    },

    'test/index.js': {
      questions: [ nameQuestion() ],
      contents: (contents, answers) => contents ||
`import 'babel-polyfill';
import ${ packageToClass(answers) } from '../src';
import chai from 'chai';
chai.should();

describe('${ packageToClass(answers) }', () => {

});
`,
    },
  };
}
export default provisionTestFiles;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionTestFiles());
}
