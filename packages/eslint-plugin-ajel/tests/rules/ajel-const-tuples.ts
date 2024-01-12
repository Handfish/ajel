import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-const-tuples';

const tester = new RuleTester();

tester.run('ajel-const-tuples', rule, {
  valid: [
    //ajel
    { code: `const [res, err] = await ajel(Promise.resolve(1));` },
    {
      code: `const [res, err] = await blimpy(Promise.resolve(1));`,
      options: [{ sjelAlias: 'sjel', ajelAlias: 'blimpy' }],
    },
    //sjel
    { code: `const [res, err] = sjel(() => null)();` },
    {
      code: `const [res, err] = limpyb(() => null)();`,
      options: [{ sjelAlias: 'limpyb', ajelAlias: 'ajel' }],
    },
    { code: `const [res, err] = sjel(Json.parse)("{}");` },
    {
      code: `const [res, err] = limpyb(Json.parse)("{}");`,
      options: [{ sjelAlias: 'limpyb', ajelAlias: 'ajel' }],
    },
  ],
  invalid: [
    //ajel
    {
      code: `
        let [a, b] = await ajel(Promise.resolve([1, 2]));
        a = [1];
        b = 2;
        console.log(a, b);
      `,
      errors: [{ messageId: 'const' }],
    },
    {
      code: `
        let [a, b] = await blimpy(Promise.resolve([1, 2]));
        a = [1];
        b = 2;
        console.log(a, b);
      `,
      options: [{ sjelAlias: 'sjel', ajelAlias: 'blimpy' }],
      errors: [{ messageId: 'const' }],
    },

    //sjel
    {
      code: `
        let [a, b] = sjel(() => [1,2])();
        a = [1];
        b = 2;
        console.log(a, b);
      `,
      errors: [{ messageId: 'const' }],
    },
    {
      code: `
        let [a, b] = limpyb(() => [1,2])();
        a = [1];
        b = 2;
        console.log(a, b);
      `,
      options: [{ sjelAlias: 'limpyb', ajelAlias: 'ajel' }],
      errors: [{ messageId: 'const' }],
    },
  ],
});
