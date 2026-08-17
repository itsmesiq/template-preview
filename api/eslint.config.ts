import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig(
    js.configs.recommended,

    ...tseslint.configs.recommended,

    eslintConfigPrettier,

    {
        files: ['src/**/*.ts'],

        plugins: {
            'simple-import-sort': simpleImportSort,
        },

        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            'prefer-const': 'error',
            'no-var': 'error',

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
);
