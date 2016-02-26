#!/usr/bin/env node
import defaultsDeep from 'lodash.defaultsdeep';
import jsonFile from 'packagesmith.formats.json';
import nameQuestion from 'packagesmith.questions.name';
import { packageToClass } from './provision-mainfiles';
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
        dependencies: {
          'react': '^0.14.3',
        },
        devDependencies: {
          'react-addons-test-utils': '^0.14.7',
          'react-dom': '^0.14.7',
          'mocha': '^2.4.5',
          'chai': '^3.5.0',
          'chai-spies': '^0.7.1',
          'karma': '^0.13.21',
          'karma-mocha': '^0.2.2',
          'karma-mocha-reporter': '^1.2.0',
          'karma-phantomjs-launcher': '^1.0.0',
          'phantomjs-prebuilt': '^2.1.4',
          'karma-sauce-launcher': '^0.3.0',
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
            'strict-react',
            'strict/test',
          ]),
        }, null, jsonDefaultIndent);
      },
    },

    'test/index.js': {
      questions: [ nameQuestion() ],
      contents: (contents, answers) => contents || `
import ${ packageToClass(answers) } from '..';
import chai from 'chai';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
chai.should();
describe('${ packageToClass(answers) }', () => {
  it('is compatible with React.Component', () => {
    ${ packageToClass(answers) }.should.be.a('function')
      .and.respondTo('render');
  });

  it('renders a React element', () => {
    React.isValidElement(<${ packageToClass(answers) }/>).should.equal(true);
  });

  describe('Rendering', () => {
    const renderer = TestUtils.createRenderer();
    it('FILL THIS IN', () => {
      renderer.render(<${ packageToClass(answers) }/>, {});
      renderer.getRenderOutput().should.deep.equal(
        <div/>
      );
    });

  });

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
