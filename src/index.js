#!/usr/bin/env node
import { runProvisionerSet, combineProvisionerSets } from 'packagesmith';
import provisionEditorConfig from 'provision-editorconfig';
import provisionGit from 'provision-git';
import provisionGitIgnore from 'provision-gitignore';
import provisionNpmBabel from 'provision-npm-babel';
import provisionNpmSemanticRelease from 'provision-npm-semantic-release';
import provisionDocgen from './provision-docgen';
import provisionEslintConfigStrict from './provision-eslint-config-strict';
import provisionGocdFe from './provision-gocd-fe';
import provisionLegacyRemoval from './provision-legacy-removal';
import provisionMainFiles from './provision-mainfiles';
import provisionPackageJson from './provision-packagejson';
import provisionReactTestSuite from './provision-react-testsuite';
import provisionReadme from './provision-readme';
import provisionStylelintConfigStrict from './provision-stylelint-config-strict';
export function provisionReactComponent() {
  return combineProvisionerSets(
    provisionEditorConfig(),
    provisionGit(),
    provisionGitIgnore({
      gitIgnoreTemplates: [
        'node',
        'windows',
        'osx',
        'linux',
      ],
      additionalLines: [
        'lib/',
        'site',
      ],
    }),
    provisionNpmBabel({
      babelVersion: 5,
      scriptName: 'build:js',
      babelConfig: {
        compact: false,
        stage: 1,
        sourceMaps: 'inline',
        ignore: 'node_modules',
      },
    }),
    provisionNpmSemanticRelease(),

    provisionDocgen(),
    provisionEslintConfigStrict(),
    provisionGocdFe(),
    provisionLegacyRemoval(),
    provisionMainFiles(),
    provisionPackageJson(),
    provisionReactTestSuite(),
    provisionReadme(),
    provisionStylelintConfigStrict(),
  );
}
export default provisionReactComponent;
if (require.main === module) {
  runProvisionerSet(process.argv[2] || process.cwd(), provisionReactComponent());
}
