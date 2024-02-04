<p align="center"><a href="https://github.com/Handfish/ajel" target="_blank"><img src="https://raw.githubusercontent.com/Handfish/ajel/main/apps/docs/public/ajel2.svg" width="100"></a></p>

<p align="center">ajel is a set of thin wrappers for try-catch, coupled with eslint rules to encourage better error handling.</p>

<p align="center">
<a href="https://www.npmjs.com/ajel" target="_blank"><img src="https://img.shields.io/npm/v/ajel.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/ajel" target="_blank"><img src="https://img.shields.io/npm/l/ajel.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/ajel" target="_blank"><img src="https://img.shields.io/npm/dt/ajel.svg" alt="NPM Downloads" /></a>
<a href="https://handfish.github.io/ajel" target="_blank"><img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white" /></a>
<a href="https://github.com/Handfish/ajel" target="_blank"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
</p>

# [ajel](https://handfish.github.io/ajel)

### Installation

`yarn add ajel eslint-plugin-ajel`

`pnpm add ajel eslint-plugin-ajel`

### Basic eslintrc

```javascript
{
  plugins: ['ajel'],
  extends: [
    'plugin:ajel/recommended',
  ],
}
```

### Advanced eslintrc

```javascript
{
  plugins: ['ajel'],
  extends: [
    'plugin:ajel/recommended',
  ],
  rules: {
    'ajel/ajel-disable-try-catch': [
      'error',
      {
        ajelAlias: 'blimpy',
        sjelAlias: "limpyb",
      },
    ],
    'ajel/ajel-disable-throw': [
      'warn',
    ],
    'ajel/ajel-require-error-handling': [
      'error',
      {
        ajelAlias: 'blimpy',
        sjelAlias: "limpyb",
      },
    ],
  },
}
```

`ajel` and `sjel` are thin wrappers for try-catch, coupled with eslint rules to encourage better error handling.
