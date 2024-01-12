import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-strict-error-instanceof';

const tester = new RuleTester();

tester.run('ajel-require-error-handling', rule, {
  valid: [
    //ajel
    {
      code: `
      const [res, err] = await ajel(Promise.resolve(1));
       if (err instanceof Error) {
         return err;
       }
      `,
    },
    {
      code: `
      const [res, err] = await blimpy(Promise.resolve(1));
       if (err instanceof Error) {
         return err;
       }
      `,
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
    },

    //sjel
    {
      code: `
      const [res, err] = sjel(() => null)();
       if (err instanceof Error) {
         return err;
       }
      `,
    },
    {
      code: `
      const [res, err] = limpyb(() => null)();
       if (err instanceof Error) {
         return err;
       }
      `,
      options: [{ ajelAlias: 'ajel', sjelAlias: 'limpyb' }],
    },
  ],
  invalid: [
    //ajel
    {
      code: `let [res, err] = await ajel(Promise.resolve(1));`,
      errors: [{ messageId: 'instanceofError' }],
    },

    //sjel
    {
      code: `let [res, err] = sjel(() => null)();`,
      errors: [{ messageId: 'instanceofError' }],
    },
  ],
});
