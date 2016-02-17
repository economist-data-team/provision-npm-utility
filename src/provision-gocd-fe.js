#!/usr/bin/env node
import defaultsDeep from 'lodash.defaultsdeep';
import jsonFile from 'packagesmith.formats.json';
import { readFileSync as readFile } from 'fs';
import { resolve as resolvePath } from 'path';
import { runProvisionerSet } from 'packagesmith';
import sortPackageJson from 'sort-package-json';
const buildShFile = readFile(resolvePath(__dirname, '../assets/build.sh'), 'utf8');
export function provisionBuildSh() {
  return {

    'build.sh': {
      permissions: 0x755,
      contents: () => buildShFile,
    },

    'package.json': {
      contents: jsonFile((packageJson) => sortPackageJson(defaultsDeep({
        scripts: {
          ci: 'sh ./build.sh', // eslint-disable-line id-length
        },
      }, packageJson))),
    },

  };
}
export default provisionBuildSh;
if (require.main === module) {
  const directoryArgPosition = 2;
  runProvisionerSet(process.argv[directoryArgPosition] || process.cwd(), provisionBuildSh());
}
