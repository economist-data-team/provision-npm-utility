#!/usr/bin/env node
import defaultsDeep from 'lodash.defaultsdeep';
import getBestVersion from './get-best-version';
import jsonFile from 'packagesmith.formats.json';
import repositoryQuestion from 'packagesmith.questions.repository';
import { runProvisionerSet } from 'packagesmith';
import sortPackageJson from 'sort-package-json';
import yamlFile from 'packagesmith.formats.yaml';

const NODEVERSION = 4.3;
export default function provisionTravisYaml() {
  return {
    '.travis.yml': {
      questions: [ repositoryQuestion() ],
      contents: yamlFile((travisYaml) => defaultsDeep({
        sudo: false,
        language: 'node_js',
        cache: {
          directories: [
            'node_modules',
          ],
        },
        'node_js': [
          NODEVERSION,
          'stable',
        ],
        'before_install': [
          'npm i -g npm',
        ],
        'script': [
          'npm t',
        ],
        'after_success': [
          'travis-after-all',
          'npm run semantic-release',
        ].join(' && '),
        deploy: {
          provider: 'npm',
          'skip_cleanup': true,
          'on': {
            repo: 'economist-data-team/',
          },
        },
      }, travisYaml)),
    },

    'package.json': {
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        defDependencies: {
          'travis-after-all': getBestVersion(packageJson, 'travis-after-all'),
        },
      }, packageJson))),
    },
  };
}

if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionTravisYaml());
}
