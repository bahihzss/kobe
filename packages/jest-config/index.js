const { pathsToModuleNameMapper } = require('ts-jest')

exports.base = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.ts', '!**/*.controller.ts', '!**/index.ts'],
  coverageDirectory: '../coverage',
}

exports.withAlias = (compilerOptions) => ({
  ...exports.base,
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
})
