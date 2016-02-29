#!/usr/bin/env node
import camelCase from 'lodash.camelcase';
import capitalize from 'lodash.capitalize';
import defaultsDeep from 'lodash.defaultsdeep';
import getObjectPath from 'lodash.get';
import jsonFile from 'packagesmith.formats.json';
import kebabCase from 'lodash.kebabcase';
import nameQuestion from 'packagesmith.questions.name';
import parsePackageJsonName from 'parse-packagejson-name';
import { readFileSync as readFile } from 'fs';
import { resolve as resolvePath } from 'path';
import { runProvisionerSet } from 'packagesmith';
import sortPackageJson from 'sort-package-json';
import unique from 'lodash.uniq';
const license = readFile(resolvePath(__dirname, '../LICENSE'), 'utf8');
function packageToCss(name) {
  return kebabCase(parsePackageJsonName(name).fullName.replace(/component-/, ''));
}
export function packageToClass(name) {
  return capitalize(camelCase(packageToCss(name)));
}
export function provisionMainFiles() {
  return {
    'LICENSE': {
      contents: () => license,
    },

    'package.json': {
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        main: 'lib/index.js',
        style: 'lib/index.css',
        example: 'lib/example.js',
        examplestyle: 'lib/example.css',
        files: unique([
          ...getObjectPath(packageJson, 'files', []),
          'lib/*',
          'assets/*',
        ]),
      }, packageJson))),
    },

    'src/index.css': {
      questions: [ nameQuestion() ],
      contents: (contents, answers) => (contents ||
`.${ packageToCss(answers) } {
}
  `),
    },

    'src/example.css': {
      contents: (contents) => (contents ||
`@import './';
`),
    },

    'src/index.js': {
      questions: [ nameQuestion() ],
      contents: (contents, answers) => (contents ||
`import React from 'react';

export default function ${ packageToClass(answers) }() {
  return (
    <div>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  ${ packageToClass(answers) }.propTypes = {
  };
}
`),
    },

    'src/example.js': {
      questions: [ nameQuestion() ],
      contents: (contents, answers) => (contents ||
`import React from 'react';
import ${ packageToClass(answers) } from './';

export default (
  <${ packageToClass(answers) }/>
)
`),
    },
  };
}
export default provisionMainFiles;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionMainFiles());
}
