module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true
    },
    plugins: ['@typescript-eslint'],
    globals: {},
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        },
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        "plugin:@typescript-eslint/recommended",
        'prettier'
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': "off",
        '@typescript-eslint/explicit-module-boundary-types': "off"
    }
};
