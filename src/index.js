#!/usr/bin/env node
import { combineProvisionerSets, runProvisionerSet } from 'packagesmith';
import { basename as baseNamePath } from 'path';
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
import provisionReactTestSuite from './provision-react-testsuite';
import provisionReadme from './provision-readme';
import provisionStylelint from 'provision-stylelint';
const git = provisionGit();
const gitRepositoryQuestionIndex = 0;
git['.git/config'].questions[gitRepositoryQuestionIndex].default = (answers, dirname) => (
  `git@github.com/economist-components/${ answers.name || baseNamePath(dirname) }`
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
      babelRuntime: true,
      scriptName: 'build:js',
    }),
    provisionNpmSemanticRelease(),
    provisionDocgen(),
    provisionEslint({
      presets: {
        'strict': '^8.2.0',
        'strict-react': '^6.0.0',
      },
      scriptName: 'lint:js',
    }),
    provisionGocdFe(),
    provisionLegacyRemoval(),
    provisionMainFiles(),
    provisionPackageJson(),
    provisionReactTestSuite(),
    provisionReadme(),
    provisionStylelint({
      presets: 'strict',
      scriptName: 'lint:css',
    }),
  );
}
export default provisionReactComponent;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionReactComponent());
}
