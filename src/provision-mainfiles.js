#!/usr/bin/env node
import { packageToClass, packageToCss } from './package-names';
import defaultsDeep from 'lodash.defaultsdeep';
import getObjectPath from 'lodash.get';
import jsonFile from 'packagesmith.formats.json';
import nameQuestion from 'packagesmith.questions.name';
import { readFileSync as readFile } from 'fs';
import { resolve as resolvePath } from 'path';
import { runProvisionerSet } from 'packagesmith';
import sortPackageJson from 'sort-package-json';
import unique from 'lodash.uniq';
const license = readFile(resolvePath(__dirname, '../LICENSE'), 'utf8');
export function provisionMainFiles() {
  return {
    'LICENSE': {
      contents: () => license,
    },

    'package.json': {
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        main: 'lib/index.js',
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
    <div className="${ packageToCss(answers) }">
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
`import 'babel-polyfill';
import ${ packageToClass(answers) } from './';
`),
    },
  };
}
export default provisionMainFiles;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionMainFiles());
}
