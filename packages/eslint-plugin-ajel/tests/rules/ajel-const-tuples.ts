import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-const-tuples';

const tester = new RuleTester();

tester.run('ajel-const-tuples', rule, {
  valid: [
    { code: `const [res, err] = await ajel(Promise.resolve(1));` },
    {
      code: `const [res, err] = await blimpy(Promise.resolve(1));`,
      options: [{ ajelAlias: 'blimpy' }],
    },
  ],
  invalid: [
    {
      code: `
        let [a, b] = await ajel(Promise.resolve([1, 2]));
        a = [1];
        b = 2;
        console.log(a, b);
      `,
      errors: [{ messageId: 'const' }],
    },
  ],
});
