import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-require-error-handling';

const tester = new RuleTester();

tester.run('ajel-require-error-handling', rule, {
  valid: [
    {
      code: `
      const [res, err] = await ajel(Promise.resolve(1));
       if (err) {
         return err;
       }
      `,
    },
    {
      code: `
      const [res, err] = await blimpy(Promise.resolve(1));
       if (err) {
         return err;
       }
      `,
      options: [{ ajelAlias: 'blimpy' }],
    },
  ],
  invalid: [
    {
      code: `let [res, _err] = await ajel(Promise.resolve(1));
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
  ],
});
