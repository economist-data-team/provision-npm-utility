import camelCase from 'lodash.camelcase';
import capitalize from 'lodash.capitalize';
import kebabCase from 'lodash.kebabcase';
import parsePackageJsonName from 'parse-packagejson-name';
export function packageToCss(name) {
  return kebabCase(parsePackageJsonName(name).fullName.replace(/component-/, ''));
}
export function packageToCamel(packageName) {
  return camelCase(packageToCss(packageName));
}
export function packageToClass(name) {
  return capitalize(packageToCamel(name));
}
