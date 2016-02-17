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

Simply import the component for use in your project:

\`\`\`js
import ${ packageToClass(answers) } from '${ answers.name }';

return <${ packageToClass(answers) }/>;
\`\`\`

For more examples on usage, see [\`src/example.es6\`]](./src/example.es6).

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
