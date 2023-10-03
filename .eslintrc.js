module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'sonarjs',
		'prettier',
		'unicorn'
	],
	extends: [
		'eslint:recommended',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:prettier/recommended',
		'plugin:sonarjs/recommended',
		'plugin:unicorn/recommended'
	],
	overrides: [
		{
			files: ['./seeder/**/*.ts'],
			rules: {
				'@typescript-eslint/no-unused-expressions': 'off',
				'unicorn/prefer-top-level-await': 'off',
				'unicorn/no-process-exit': 'off',
				'@typescript-eslint/no-shadow': 'off',
				'no-param-reassign': 'off',
				'no-constant-condition': 'off',
				'sonarjs/cognitive-complexity': 'off',
				'@typescript-eslint/prefer-nullish-coalescing': 'off',
				'sonarjs/no-duplicate-string': 'off',
				'sonarjs/no-identical-functions': 'off',
				'@typescript-eslint/no-unnecessary-condition': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/no-unsafe-return': 'off'
			}
		}
	],
	root: true,
	env: {
		node: true,
		jest: true
	},
	ignorePatterns: ['.eslintrc.js', '*.js', './books_1.Best_Books_Ever.json'],
	rules: {
		'unicorn/filename-case': 'off',
		'@typescript-eslint/semi': 'off',
		'@typescript-eslint/indent': 'off',
		'unicorn/no-keyword-prefix': 'off',
		'class-methods-use-this': 'off',
		'consistent-return': 'off',
		'@typescript-eslint/no-throw-literal': 'off',
		'func-names': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/extensions': 'off',
		'import/named': 'off',
		'import/no-default-export': 'off',
		'import/prefer-default-export': 'off',
		'newline-per-chained-call': 'off',
		'no-await-in-loop': 'off',
		'no-continue': 'off',
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
		'no-underscore-dangle': ['error', { allow: ['_id', '_count', '_sum'] }],
		'no-void': ['error', { allowAsStatement: true }],
		'spaced-comment': [
			'error',
			'always',
			{ line: { markers: ['/', '#region', '#endregion'] } }
		],
		'@typescript-eslint/consistent-type-assertions': [
			'error',
			{ assertionStyle: 'angle-bracket' }
		],
		'@typescript-eslint/lines-between-class-members': [
			'error',
			'always',
			{ exceptAfterSingleLine: true }
		],
		'@typescript-eslint/no-extraneous-class': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'sonarjs/cognitive-complexity': ['error', 25],
		'sonarjs/cognitive-complexity': 'error',
		'sonarjs/no-identical-expressions': 'error',
		'@typescript-eslint/no-unnecessary-condition': 'off',
		'@typescript-eslint/prefer-nullish-coalescing': 'off',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'default',
				format: ['camelCase', 'PascalCase'],
				filter: {
					regex: '^(count)$',
					match: true
				}
			},
			{
				selector: 'variable',
				format: ['PascalCase', 'UPPER_CASE'],
				types: ['boolean'],
				prefix: ['is', 'should', 'has', 'can', 'did', 'will']
			},
			{
				selector: 'variableLike',
				format: ['camelCase', 'UPPER_CASE', 'PascalCase']
			},
			{
				selector: 'parameter',
				format: ['camelCase']
			},
			{
				selector: 'memberLike',
				modifiers: ['private'],
				format: ['camelCase'],
				leadingUnderscore: 'forbid'
			},
			{
				selector: 'typeLike',
				format: ['PascalCase']
			},
			{
				selector: 'property',
				modifiers: ['readonly'],
				format: ['PascalCase']
			},
			{
				selector: 'enumMember',
				format: ['UPPER_CASE']
			}
		]
	}
}
