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
        sourceType: 'module'
    },
    extends: ['eslint:recommended'],
    rules: {
        'arrow-spacing': 'error',
        'block-spacing': 'error',
        'comma-dangle': 'off',
        'comma-spacing': 'error',
        'comma-style': 'error',
        curly: 'error',
        'dot-notation': 'error',
        eqeqeq: 'error',
        'eol-last': 'error',
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'linebreak-style': ['error', 'unix'],
        'no-console': 'off',
        'no-param-reassign': 'error',
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-underscore-dangle': 'error',
        'no-var': 'error',
        'no-whitespace-before-property': 'error',
        'prefer-const': 'error',
        semi: ['error', 'always'],
        'semi-spacing': 'error',
        'space-before-blocks': 'error',
        'space-before-function-paren': ['error', 'never'],
        'space-in-parens': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error']
    }
};
