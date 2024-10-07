module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
    'next/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  ignorePatterns: ['*.d.ts'],
  rules: {
    'no-redeclare': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    // General
    'import/no-extraneous-dependencies': 'off',
    'no-console': [
      'warn', {
        allow: [
          'warn',
          'error',
          'info',
          'table',
        ],
      },
    ],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    camelcase: [
      'warn',
      {
        properties: 'always',
        ignoreDestructuring: true,
        ignoreImports: true,
        ignoreGlobals: true,
        allow: [
          '^[A-Z]',
        ],
      },
    ],
    'linebreak-style': 0,
    'max-len': 0,
    'object-curly-spacing': 2,
    'no-plusplus': [
      'error', {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-continue': 'off',
    'no-empty': 'off',
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    // Variables
    'one-var': 'error',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    // Functions
    'require-jsdoc': 'off',
    'no-param-reassign': [2, { props: false }],
    'consistent-return': 'off',
    'func-names': 'off',
    // Classes
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    'no-dupe-class-members': 'off',
    // Imports
    'import/no-named-default': 'off',
    'import/no-cycle': 'error',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': [
      2, {
        ignore: ['^@'],
      },
    ],
    'no-restricted-imports': ['error', {
      paths: [
        {
          name: 'axios',
          importNames: ['default'],
          message: 'Please use the `HttpService` class instead.',
        },
        {
          name: 'config',
          message: 'Please use the `Config` class instead.',
        },
        {
          name: 'lullo-utils',
          importNames: ['AWSS3Utils'],
          message: 'Please use the `S3` class. It logs the S3 activity.',
        },
        {
          name: 'tsyringe',
          message: 'Please import from the `TSyringe` framework index.',
        },
        {
          name: 'app-root-path',
          message: 'Please use the `rootPath` function.',
        },
        {
          name: 'next-auth',
          importNames: ['getServerSession'],
          message: 'Please use the `getServerSession` function in utils.',
        },
      ],
    }],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src',
            from: '#common/errors/ApiException.ts',
            message: "The ApiException class should not be used outside the decorators and middlewares. Use 'new ApiError({...})' instead!",
          },
        ],
      },
    ],
    'import/extensions': 'off',
    // TS - General
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    // TS - Types
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    // TS - Variables
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-use-before-define': ['error'],
    // TS -Functions
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
  overrides: [
    {
      excludedFiles: [],
      files: [
        '**/*.test.ts',
        'tests/**/*.ts',
      ],
      rules: {
        'require-jsdoc': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'max-classes-per-file': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      alias: {
        extensions: ['.js', '.jsx'],
        map: [
          ['@', '.'],
        ],
      },
      node: {
        extensions: ['.js', '.ts', '.d.ts'],
      },
      typescript: {},
    },
    react: {
      version: 'detect',
    },
  },
};

