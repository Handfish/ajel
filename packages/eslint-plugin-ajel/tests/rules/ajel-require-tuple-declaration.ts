import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-require-tuple-declaration';

const tester = new RuleTester();

tester.run('ajel-require-tuple-declaration', rule, {
  valid: [
    {
      code: `const [res, err] = await ajel(Promise.resolve(1));`,
    },
    {
      code: `const [res, err] = await blimpy(Promise.resolve(1));`,
      options: [{ ajelAlias: 'blimpy' }],
    },
  ],
  invalid: [
    {
      code: 'const [err] = await ajel(Promise.resolve(1));',
      errors: [{ messageId: 'tupleLen2' }],
    },
    {
      code: 'const [res, err], anothervar = await ajel(Promise.resolve(1));',
      errors: [{ messageId: 'limitDeclarations' }],
    },
  ],
});
