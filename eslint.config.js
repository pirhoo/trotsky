const tseslint = require('typescript-eslint')

module.exports = tseslint
  .config(tseslint.configs.strict, tseslint.configs.stylistic, {
    ignores: ['.dist', 'eslint.config.js'],
  })