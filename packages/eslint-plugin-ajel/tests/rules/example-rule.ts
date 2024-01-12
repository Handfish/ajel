import { RuleTester } from "eslint";
import rule from "../../src/rules/example-rule";

const tester = new RuleTester({
  parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
  }
});

tester.run('example-rule', rule, {
  valid: ['const foo = 1;'],
  invalid: [
    {
      code: 'const example = 1;',
      errors: [{ messageId: 'disallowExample' }],
    },
  ],
});
