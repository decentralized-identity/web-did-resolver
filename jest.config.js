module.exports = {
  transform: {
    '^.+\\.jsx?$': '<rootDir>/../node_modules/babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: { 'ts-jest': { useBabelrc: true } },
  rootDir: 'src',
}
