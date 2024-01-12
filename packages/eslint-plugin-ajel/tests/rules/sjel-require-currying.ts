import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/sjel-require-currying';

const tester = new RuleTester();

tester.run('sjel-require-currying', rule, {
  valid: [
    //sjel
    { code: `const [res, err] = sjel(() => null)();` },
    {
      code: `const [res, err] = limpyb(() => null)();`,
      options: [{ sjelAlias: 'limpyb' }],
    },
  ],
  invalid: [
    //sjel
    {
      code: `
        const [a, b] = sjel(() => null);
      `,
      errors: [{ messageId: 'currying' }],
    },
    {
      code: `
        const [a, b] = limpyb(() => null);
      `,
      options: [{ sjelAlias: 'limpyb' }],
      errors: [{ messageId: 'currying' }],
    },
  ],
});
