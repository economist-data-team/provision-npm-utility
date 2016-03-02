#!/usr/bin/env node
import descriptionQuestion from 'packagesmith.questions.description';
import nameQuestion from 'packagesmith.questions.name';
import { packageToClass } from './provision-mainfiles';
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

The default export is a React Component, so you can simply import the component and use
it within some JSX, like so:

\`\`\`js
import ${ packageToClass(answers) } from '${ answers.name }';

return <${ packageToClass(answers) }/>;
\`\`\`

For more examples on usage, see [\`src/example.es6\`](./src/example.es6).

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
