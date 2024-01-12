import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-disable-try-catch';

const tester = new RuleTester();

tester.run('ajel-disable-try-catch', rule, {
  valid: [{ code: `` }],
  invalid: [
    {
      code: `try {
        throw new Error('');
      } catch (e) {
        throw e;
      }
      `,
      errors: [{ messageId: 'tryStatement' }],
    },
  ],
});
