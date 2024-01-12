import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-require-error-handling';

const tester = new RuleTester();

tester.run('ajel-require-error-handling', rule, {
  valid: [
    //ajel
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
      const [res, _err] = await ajel(Promise.resolve(1));
       if (err) {
         return _err;
       }
      `,
    },
    {
      code: `
      async function test() {
        const [res, _err] = await ajel(Promise.resolve(1));
         if (err) {
           return _err;
         }
      }
      `,
    },
    {
      code: `
      const hello = async () => {
        const [res, _err] = await ajel(Promise.resolve(1));
         if (err) {
           return _err;
         }
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
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
    },

    //sjel
    {
      code: `
      const [res, err] = sjel(() => null)();
       if (err) {
         return err;
       }
      `,
    },
    {
      code: `
      const [res, _err] = sjel(() => null)();
       if (err) {
         return _err;
       }
      `,
    },
    {
      code: `
      async function test() {
        const [res, _err] = await sjel(() => null)();
         if (err) {
           return _err;
         }
      }
      `,
    },
    {
      code: `
      const hello = async () => {
        const [res, _err] = sjel(() => null)();
         if (err) {
           return _err;
         }
      }
      `,
    },
    {
      code: `
      const [res, err] = limpyb(() => null)();
       if (err) {
         return err;
       }
      `,
      options: [{ ajelAlias: 'limpyb', sjelAlias: 'sjel' }],
    },
  ],
  invalid: [
    //ajel
    {
      code: `const [res, _err] = await ajel(Promise.resolve(1));
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `
      async function test() {
        const [res, _err] = await ajel(Promise.resolve(1));
      }
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `
      const hello = async () => {
        const [_a, _b] = await ajel(Promise.resolve('hello'));
        console.log(_a);
      };
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `let [res, _err] = await ajel(Promise.resolve(1));
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `let [res, _err] = await blimpy(Promise.resolve(1));
      `,
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
      errors: [{ messageId: 'requireErrorHandling' }],
    },

    //sjel
    {
      code: `const [res, _err] = sjel(() => null)();
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `
      async function test() {
        const [res, _err] = sjel(() => null)();
      }
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `
      const hello = async () => {
        const [_a, _b] = sjel(() => null)();
        console.log(_a);
      };
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `let [res, _err] = sjel(() => null)();
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `let [res, _err] = limpyb(() => null)();
      `,
      options: [{ ajelAlias: 'ajel', sjelAlias: 'limpyb' }],
      errors: [{ messageId: 'requireErrorHandling' }],
    },
  ],
});
