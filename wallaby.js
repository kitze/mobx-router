module.exports = function (wallaby) {
  return {
    files: [
      'tests/mocks/*.js',
      'src/**/*.js'
    ],
    tests: [
      'tests/**/*spec.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    bootstrap: function (wallaby) {
      wallaby.testFramework.configure({
        "scriptPreprocessor": "<rootDir>/node_modules/babel-jest",
        "moduleDirectories": [
          "node_modules",
          "src"
        ]
      });
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};