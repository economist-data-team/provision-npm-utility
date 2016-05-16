#!/usr/bin/env node

import { combineProvisionerSets, runProvisionerSet } from 'packagesmith';
import { basename as baseNamePath } from 'path';
import packageVersions from '../package-versions';
import provisionDocgen from './provision-docgen';
import provisionEditorConfig from 'provision-editorconfig';
import provisionEslint from 'provision-eslint';
import provisionGit from 'provision-git';
import provisionGitIgnore from 'provision-gitignore';
import provisionGocdFe from './provision-gocd-fe';
import provisionLegacyRemoval from './provision-legacy-removal';
import provisionMainFiles from './provision-mainfiles';
import provisionNpmBabel from 'provision-npm-babel';
import provisionNpmSemanticRelease from 'provision-npm-semantic-release';
import provisionPackageJson from './provision-packagejson';
import provisionReadme from './provision-readme';
import provisionTestSuite from './provision-testsuite';
import provisionTravisYaml from './provision-travis.js';
const git = provisionGit();
const gitRepositoryQuestionIndex = 0;
git['.git/config'].questions[gitRepositoryQuestionIndex].default = (answers, dirname) => (
  `git@github.com:economist-data-team/${ answers.name || baseNamePath(dirname) }.git`
);
export function provisionReactComponent() {
  return combineProvisionerSets(
    provisionEditorConfig(),
    git,
    provisionGitIgnore({
      gitIgnoreTemplates: [
        'node',
        'windows',
        'osx',
        'linux',
      ],
      additionalLines: [
        'lib/',
        'site/',
      ],
    }),
    provisionNpmBabel({
      babelVersion: 5,
      babelStage: 2,
      scriptName: 'build:js',
      babelConfig: {
        compact: false,
        ignore: 'node_modules',
      },
    }),
    provisionNpmSemanticRelease(),
    provisionDocgen(),
    provisionEslint({
      presets: {
        'strict': packageVersions['eslint-config-strict'],
        'strict-react': packageVersions['eslint-config-strict-react'],
      },
      scriptName: 'lint:js',
    }),
    provisionGocdFe(),
    provisionLegacyRemoval(),
    provisionMainFiles(),
    provisionPackageJson(),
    provisionTestSuite(),
    provisionReadme(),
    provisionTravisYaml(),
  );
}
export default provisionReactComponent;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionReactComponent());
}
