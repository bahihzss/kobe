const jestConfig = require('@kobe/jest-config')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...jestConfig.withAlias(compilerOptions),
  rootDir: '.',
  roots: ['<rootDir>/src'],
}
