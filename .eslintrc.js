module.exports = {
  extends: "airbnb-base",
  env: {
    node: true,
    es6: true
  },
  rules: {
    'radix': 'off',
    'camelcase': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-multi-spaces': 'off',
    'arrow-body-style': 'off',
    'object-shorthand': 'off',
    'no-param-reassign': 'off',
    'object-curly-spacing': 'off',
    'prefer-destructuring': 'off',
    'no-use-before-define': 'off',
    'space-infix-ops': ['warn'],
    'comma-spacing': ['warn'],
    'keyword-spacing': ['warn'],
    'prefer-const': ['warn'],
    'semi': ['warn', 'always'],
    'comma-dangle': ["warn", "never"],
    'arrow-parens': ['warn', 'as-needed'],
    'space-in-parens': ['warn', 'never'],
    // 'key-spacing': ["warn", { "align": "colon" }],
    'newline-per-chained-call': 'off',
    'no-mixed-operators': 'off',
    'no-await-in-loop': 'off',
    'no-lonely-if': 'off',
    'no-continue': 'off',
    "class-methods-use-this": "off"
  },
};
