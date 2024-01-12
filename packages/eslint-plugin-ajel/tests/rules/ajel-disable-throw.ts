import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-disable-throw';

const tester = new RuleTester();

tester.run('ajel-disable-throw', rule, {
  valid: [{ code: `` }],
  invalid: [
    {
      code: `throw new Error('');`,
      errors: [{ messageId: 'throwStatement' }],
    },
  ],
});
