import { RuleTester } from '../../node_modules/@typescript-eslint/rule-tester/dist';
import rule from '../../src/rules/ajel-require-error-handling';

const tester = new RuleTester();

tester.run('ajel-require-error-handling', rule, {
  valid: [
    //ajel
    {
      code: `
      const result = await ajel(JSON.parse('{}'));
      if (result instanceof Error) {
        return;
      }
      console.log(result);
      `,
    },
    {
      code: `
      const result = await ajel(JSON.parse('{}'));

      switch (true) {
        case result instanceof Error:
          return;
        default:
      }

      console.log(result);
      `,
    },
    {
      code: `
      async function test() {
        const result = await ajel(JSON.parse('{}'));

        switch (true) {
          case result instanceof Error:
            return;
          default:
        }

        console.log(result);
      }
      `,
    },
    {
      code: `
      async function test() {
        const result = await ajel(JSON.parse('{}'));
        if (result instanceof Error) {
          return;
        }
        console.log(result);
      }
      `,
    },
    {
      code: `
      const hello = async () => {
        const result = await ajel(JSON.parse('{}'));
        if (result instanceof Error) {
          return;
        }
        console.log(result);
      }
      `,
    },
    {
      code: `
      class CustomError extends Error { }

      const result = await ajel(JSON.parse('{}'));
      if (result instanceof CustomError) {
        console.log(result);
        return;
      }
      if (result instanceof Error) {
        return;
      }
      console.log(result);
      `,
    },
    {
      code: `
      class CustomError extends Error { }
      class CustomError2 extends Error { }

      const result = await ajel(JSON.parse('{}'));
      switch (true) {
          case result instanceof CustomError:
            console.log(result);
            return;
          case result instanceof CustomError2:
          case result instanceof Error:
            return;
          default:
      }

      console.log(result);
      `,
    },
    {
      code: `
      const hello = async () => {
        const result = await ajel(JSON.parse('{}'));

        switch (true) {
          case result instanceof Error:
            return;
          default:
        }

        console.log(test);
      }
      `,
    },
    {
      code: `
      const result = await blimpy(JSON.parse('{}'));
      if (result instanceof Error) {
        return;
      }
      console.log(result);
      `,
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
    },

    //sjel
    {
      code: `
      const result = await ajel(JSON.parse, '{}');
      if (result instanceof Error) {
        return;
      }
      console.log(result);
      `,
    },
    {
      code: `
      const result = await ajel(JSON.parse, '{}');

      switch (true) {
        case result instanceof Error:
          return;
        default:
      }

      console.log(result);
      `,
    },
    {
      code: `
      async function test() {
        const result = await ajel(JSON.parse, '{}');

        switch (true) {
          case result instanceof Error:
            return;
          default:
        }

        console.log(result);
      }
      `,
    },
    {
      code: `
      async function test() {
        const result = sjel(JSON.parse, '{}');
        if (result instanceof Error) {
          return;
        }
        console.log(result);
      }
      `,
    },
    {
      code: `
      const hello = async () => {
        const result = sjel(JSON.parse, '{}');
        if (result instanceof Error) {
          return;
        }
        console.log(result);
      }
      `,
    },
    {
      code: `
      const hello = async () => {
        const result = sjel(JSON.parse, '{}');

        switch (true) {
          case result instanceof Error:
            return;
          default:
        }

        console.log(result);
      }
      `,
    },
    {
      code: `
      class CustomError extends Error { }

      const result = await sjel(JSON.parse, '{}');
      if (result instanceof CustomError) {
        console.log(result);
        return;
      }
      if (result instanceof Error) {
        return;
      }
      console.log(result);
      `,
    },
    {
      code: `
      class CustomError extends Error { }
      class CustomError2 extends Error { }

      const result = await sjel(JSON.parse, '{}');
      switch (true) {
          case result instanceof CustomError:
            console.log(result);
            return;
          case result instanceof CustomError2:
          case result instanceof Error:
            return;
          default:
      }

      console.log(result);
      `,
    },
    {
      code: `
      const result = sjel(JSON.parse, '{}');
      if (result instanceof Error) {
        return;
      }
      console.log(result);
      `,
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
    },
  ],
  // -------------------  invalid  -------------------
  // -------------------  invalid  -------------------
  // -------------------  invalid  -------------------
  invalid: [
    //ajel
    {
      code: `
      const result = await ajel(JSON.parse('{}'));

      console.log(result);

      if (result instanceof Error) {
        return;
      }
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const result = await ajel(JSON.parse('{}'));

      console.log(result);

      switch (true) {
        case result instanceof Error:
          return;
        default:
      }
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const hello = async () => {
        const result = await ajel(JSON.parse('{}'));

        console.log(result);

        if (result instanceof Error) {
          return;
        }
      };
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const hello = async () => {
        const result = await ajel(JSON.parse('{}'));

        console.log(result);

        switch (true) {
          case result instanceof Error:
            return;
          default:
        }
      };
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const result = await ajel(JSON.parse('{}'));

      console.log(result);
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `
      const result = await blimpy(JSON.parse('{}'));

      console.log(result);

      if (result instanceof Error) {
        return;
      }
      `,
      options: [{ ajelAlias: 'blimpy', sjelAlias: 'sjel' }],
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },

    //sjel
    {
      code: `
      const result = sjel(JSON.parse, '{}');

      console.log(result);

      if (result instanceof Error) {
        return;
      }
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const result = sjel(JSON.parse, '{}');

      console.log(result);

      switch (true) {
        case result instanceof Error:
          return;
        default:
      }
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const hello = async () => {
        const result = sjel(JSON.parse, '{}');

        console.log(result);

        if (result instanceof Error) {
          return;
        }
      };
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const hello = async () => {
        const result = sjel(JSON.parse, '{}');

        console.log(result);

        switch (true) {
          case result instanceof Error:
            return;
          default:
        }
      };
      `,
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
    {
      code: `
      const result = sjel(JSON.parse, '{}');

      console.log(result);
      `,
      errors: [{ messageId: 'requireErrorHandling' }],
    },
    {
      code: `
      const result = await limpyb(JSON.parse, '{}');

      console.log(result);

      if (result instanceof Error) {
        return;
      }
      `,
      options: [{ ajelAlias: 'limpyb', sjelAlias: 'sjel' }],
      errors: [{ messageId: 'usedBeforeErrorHandling' }],
    },
  ],
});
