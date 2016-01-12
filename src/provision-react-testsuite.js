#!/usr/bin/env node
import { runProvisionerSet } from 'packagesmith';
import nameQuestion from 'packagesmith.questions.name';
import jsonFile from 'packagesmith.formats.json';
import sortPackageJson from 'sort-package-json';
import defaultsDeep from 'lodash.defaultsdeep';
import unique from 'lodash.uniq';
import { packageToClass } from './provision-mainfiles';
import { readFileSync as readFile } from 'fs';
import { resolve as resolvePath } from 'fs';
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
          'react-addons-test-utils': '^0.14.3',
          'react-dom': '^0.14.3',
          'mocha': '^2.2.5',
          'chai': '^3.4.1',
          'chai-spies': '^0.7.1',
          'karma': '^0.13.5',
          'karma-mocha': '^0.2.1',
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
        }, null, 2);
      },
    },

    'test/index.js': {
      questions: [ nameQuestion() ],
      contents: (contents, answers) => contents || `
import ${packageToClass(answers)} from '..';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
describe('Icon', () => {
  it('is compatible with React.Component', () => {
    ${packageToClass(answers)}.should.be.a('function')
      .and.respondTo('render');
  });

  it('renders a React element', () => {
    React.isValidElement(<${packageToClass(answers)}/>).should.equal(true);
  });

  describe('Rendering', () => {
    const renderer = TestUtils.createRenderer();
    it('FILL THIS IN', () => {
      renderer.render(<${packageToClass(answers)}/>, {});
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
  runProvisionerSet(process.argv[2] || process.cwd(), provisionTestFiles());
}
