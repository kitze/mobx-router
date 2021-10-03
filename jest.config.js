module.exports = {
    testEnvironment: "jsdom",
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '((\\.|/)spec)\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    moduleDirectories: ['node_modules', 'src']
};
