#!/usr/bin/env node
import descriptionQuestion from 'packagesmith.questions.description';
import nameQuestion from 'packagesmith.questions.name';
import { packageToClass } from './package-names';
import { runProvisionerSet } from 'packagesmith';
export function provisionReadme() {
  return {
    'README.md': {
      questions: [
        nameQuestion(),
        descriptionQuestion(),
      ],
      contents: (contents, answers) => contents || `
# ${ packageToClass(answers) }
> ${ answers.description }

## Usage

**This component expects an ES6 environment**, and so if you are using this in an app,
you should drop in a polyfill library - it has been tested with [babel-polyfill] but
[core-js] or [es6-shim] may also work.

[babel-polyfill]: https://babeljs.io/docs/usage/polyfill/
[core-js]: https://www.npmjs.com/package/core-js
[es6-shim]: https://www.npmjs.com/package/es6-shim

## Install

\`\`\`bash
npm i -S ${ answers.name }
\`\`\`

## Run tests

\`\`\`bash
npm test
\`\`\`
`,
    },
  };
}
export default provisionReadme;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionReadme());
}
