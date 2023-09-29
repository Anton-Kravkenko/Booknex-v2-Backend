module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', './books_1.Best_Books_Ever.json'],
  rules: {
     "@typescript-eslint/naming-convention":[
       "error",
       {
            selector: "default",
            format: ["camelCase", 'PascalCase'],
         filter: {
           regex: '^(count)$',
           match: true,
         }
       },
       {
         selector: "variable",
         format: ["PascalCase", "UPPER_CASE"],
         types: ["boolean"],
         prefix: ["is", "should", "has", "can", "did", "will"],
       },
       {
         selector: "variableLike",
         format: ["camelCase", "UPPER_CASE", "PascalCase"],
       },
       {
         selector: "parameter",
         format: ["camelCase"],
       },
       {
         selector: "memberLike",
         modifiers: ["private"],
         format: ["camelCase"],
         leadingUnderscore: "forbid",
       },
       {
         selector: "typeLike",
         format: ["PascalCase"],
       },
       {
         selector: "property",
         modifiers: ["readonly"],
         format: ["PascalCase"],
       },
       {
         selector: "enumMember",
         format: ["UPPER_CASE"],
       },
     
     ]
  },
};
