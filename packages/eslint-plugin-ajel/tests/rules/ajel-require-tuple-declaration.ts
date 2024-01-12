import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-require-tuple-declaration';

const tester = new RuleTester();

tester.run('ajel-require-tuple-declaration', rule, {
  valid: [
    //ajel
    {
      code: `const [res, err] = await ajel(Promise.resolve(1));`,
    },
    {
      code: `const [res, err] = await blimpy(Promise.resolve(1));`,
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
    },

    //sjel
    {
      code: `const [res, err] = sjel(Promise.resolve(1));`,
    },
    {
      code: `const [res, err] = limpyb(Promise.resolve(1));`,
      options: [{ ajelAlias: 'ajel', sjelAlias: 'limpyb' }],
    },
  ],
  invalid: [
    //ajel
    {
      code: 'const [err] = await ajel(Promise.resolve(1));',
      errors: [{ messageId: 'tupleLen2' }],
    },
    {
      code: 'const [res, err], anothervar = await ajel(Promise.resolve(1));',
      errors: [{ messageId: 'limitDeclarations' }],
    },

    //sjel
    {
      code: 'const [err] = sjel(() => null)();',
      errors: [{ messageId: 'tupleLen2' }],
    },
    {
      code: 'const [res, err], anothervar = sjel(() => null)();',
      errors: [{ messageId: 'limitDeclarations' }],
    },
  ],
});
