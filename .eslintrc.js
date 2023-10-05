module.exports = {
	parser: '@typescript-eslint/parser',

	plugins: ['@typescript-eslint/eslint-plugin', 'sonarjs', 'unicorn'],
	extends: [
		'eslint:recommended',
		'airbnb-typescript',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:sonarjs/recommended',
		'plugin:unicorn/recommended'
	],
	root: true,
	env: {
		node: true
	},
	ignorePatterns: ['.eslintrc.js', '*.js', '/seeder/**'],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module'
	},
	rules: {
		'unicorn/no-null': ['warn'],
		'max-len': [
			'error',
			{ code: 200, ignoreTemplateLiterals: true, ignoreUrls: true }
		],
		'no-param-reassign': ['error', { props: false }],
		'no-restricted-syntax': [
			'error',
			'ForInStatement',
			'LabeledStatement',
			'WithStatement'
		],
		'no-underscore-dangle': ['error', { allow: ['_sum', '_count'] }],
		'no-void': ['error', { allowAsStatement: true }],
		'spaced-comment': [
			'error',
			'always',
			{ line: { markers: ['*package', '!', ',', ' '] } }
		],
		'@typescript-eslint/lines-between-class-members': [
			'error',
			'always',
			{ exceptAfterSingleLine: true }
		],
		'sonarjs/cognitive-complexity': 'error',
		'sonarjs/no-identical-expressions': 'error',
		'@typescript-eslint/naming-convention': [
			'error',
			{ selector: 'default', format: null },
			{
				selector: 'variable',
				format: null,
				types: ['boolean', 'string', 'number']
			},
			{
				selector: 'variableLike',
				format: ['camelCase', 'PascalCase', 'UPPER_CASE']
			},
			{ selector: 'parameter', format: null },
			{ selector: 'memberLike', format: ['camelCase', 'PascalCase'] },
			{ selector: 'typeLike', format: ['PascalCase'] },
			{ selector: 'property', format: null },
			{ selector: 'enumMember', format: null }
		],
		'unicorn/filename-case': [
			'error',
			{
				case: 'kebabCase',
				ignore: ['App.tsx', 'use', 'sum']
			}
		],
		'@typescript-eslint/comma-dangle': 'off',
		'@typescript-eslint/semi': 'off',
		'@typescript-eslint/unbound-method': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/no-extraneous-class': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unnecessary-condition': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/prefer-nullish-coalescing': 'off',
		'@typescript-eslint/no-throw-literal': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/extensions': 'off',
		'import/named': 'off',
		'import/no-default-export': 'off',
		'import/prefer-default-export': 'off',
		'class-methods-use-this': 'off',
		'consistent-return': 'off',
		'newline-per-chained-call': 'off',
		'no-await-in-loop': 'off',
		'no-continue': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'react/jsx-filename-extension': 'off',
		'unicorn/no-nested-ternary': 'off'
	}
}
