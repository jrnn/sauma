module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "jest/globals": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "plugins": [
    "jest"
  ],
  "rules": {
    "arrow-spacing": [
      "error",
        {
          "before": true,
          "after": true
        }
    ],
    "eqeqeq": "error",
    "indent": [
      "error",
      2,
      {
        "SwitchCase" : 1
      }
    ],
    "no-console": 0,
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ]
  }
}
