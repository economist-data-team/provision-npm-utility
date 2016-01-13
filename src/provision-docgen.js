#!/usr/bin/env node
import { runProvisionerSet } from 'packagesmith';
import jsonFile from 'packagesmith.formats.json';
import multiline from 'packagesmith.formats.multiline';
import sortPackageJson from 'sort-package-json';
import compose from 'lodash.compose';
import defaultsDeep from 'lodash.defaultsdeep';
import getObjectPath from 'lodash.get';
function addDoc(packageJson) {
  return defaultsDeep({
    directories: {
      site: 'site',
    },
    devDependencies: {
      'npm-run-all': '^1.3.3',
      'git-directory-deploy': '^1.3.0',
    },
    scripts: {
      'prewatch:doc': 'npm run predoc',
      predoc: 'mkdir -p $npm_package_directories_site',
      doc: 'npm-run-all --parallel doc:*',
      'watch:doc': 'npm-run-all --parallel watch:doc:*',
      prepages: 'npm run doc',
      pages: 'git-directory-deploy --directory $npm_package_directories_site --branch gh-pages',
      start: 'npm run watch',
      watch: 'npm-run-all --parallel watch:*',
    },
  }, packageJson);
}

function addDocAssets(packageJson) {
  return defaultsDeep({
    devDependencies: {
      'npm-assets': '^0.1.0',
    },
    scripts: {
      'doc:assets': 'npm-assets $npm_package_directories_site',
      'watch:doc:assets': 'npm run doc:assets',
    },
  }, packageJson);
}

function addDocCss(packageJson) {
  return defaultsDeep({
    devDependencies: {
      'postcss-import': '^7.1.3',
      'postcss-url': '^5.0.2',
      'postcss-cssnext': '^2.3.0',
      'postcss-reporter': '^1.3.0',
      'postcss-cli': '^2.3.3',
    },
    config: {
      doc: {
        css: {
          options: getObjectPath(packageJson, 'config.doc.css.options', [
            '-u postcss-import',
            '-u postcss-url',
            '-u postcss-cssnext',
            '-u postcss-reporter',
          ].join(' ')),
        },
      },
    },
    scripts: {
      'doc:css': [
        'postcss',
        '$npm_package_config_doc_css_options',
        '$npm_package_examplestyle',
        '-o $npm_package_directories_site/bundle.css',
      ].join(' '),
      'watch:doc:css': 'npm run doc:css -- --watch',
    },
  }, packageJson);
}

function addDocHtml(packageJson) {
  return defaultsDeep({
    devDependencies: {
      '@economist/doc-pack': '^1.0.0',
      'hbs-cli': '^1.0.0',
    },
    config: {
      doc: {
        html: {
          files: getObjectPath(packageJson, 'config.doc.html.files', [
            '@economist/doc-pack/templates/index.hbs',
            '@economist/doc-pack/templates/standalone.hbs',
          ].join(' ')),
        },
      },
    },
    scripts: {
      'doc:html': [
        'hbs',
        '-H @economist/doc-pack',
        '-o $npm_package_directories_site',
        '$npm_package_config_doc_html_files',
      ].join(' '),
      'watch:doc:html': 'npm run doc:html -- --watch',
    },
  }, packageJson);
}

function addDocJs(packageJson) {
  return defaultsDeep({
    devDependencies: {
      'browserify': '^12.0.0',
    },
    config: {
      doc: {
        js: { // eslint-disable-line id-length
          options: getObjectPath(packageJson, 'config.doc.js.options', '-d -r react -r react-dom'),
        },
      },
    },
    scripts: {
      'doc:js': 'browserify ' +
        '$npm_package_config_doc_js_options ' +
        '$npm_package_directories_test/*.js ' +
        '-o $npm_package_directories_site/bundle.js',
      'watch:doc:js': 'watchify ' +
        '$npm_package_config_doc_js_options ' +
        '$npm_package_directories_test/*.js ' +
        '-o $npm_package_directories_site/bundle.js',
    },
  }, packageJson);
}

export function provisionDocgen() {
  return {
    'package.json': {
      after: [ 'npm install' ],
      contents: jsonFile(compose(
        sortPackageJson,
        addDocJs,
        addDocHtml,
        addDocCss,
        addDocAssets,
        addDoc,
      )),
    },

    '.gitignore': {
      contents: multiline((lines) => lines.concat([ 'site' ])),
    },

  };
}
export default provisionDocgen;
if (require.main === module) {
  runProvisionerSet(process.argv[2] || process.cwd(), provisionDocgen());
}
