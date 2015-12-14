#!/usr/bin/env node
import nameQuestion from 'packagesmith.questions.name';
import descriptionQuestion from 'packagesmith.questions.description';
import { runProvisionerSet } from 'packagesmith';
import { packageToClass } from './provision-mainfiles';
export function provisionReadme() {
  return {
    'README.md': {
      questions: [
        nameQuestion(),
        descriptionQuestion(),
      ],
      contents: (contents, answers) => contents || `
# ${packageToClass(answers)}
> ${answers.description}

## Usage

Simply import the component for use in your project:

\`\`\`js
import ${packageToClass(answers)} from '${answers}';

return <${packageToClass(answers)}/>;
\`\`\`

For more examples on usage, see [\`src/example.es6\`]](./src/example.es6).

## Install

\`\`\`bash
npm i -S ${answers}
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
  runProvisionerSet(process.argv[2] || process.cwd(), provisionReadme());
}
