import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * CrowdyJS targets two GraphQL endpoints (cks-management-api for auth /
 * users, cks-game-api for everything else). For codegen we need a single
 * merged schema that's the union of:
 *
 *   - cks-management-api/schema.gql (Mutation.login, register, me, ...)
 *   - cks-game-api/schema.gql       (everything else)
 *
 * The simplest workflow is to symlink or concat both into ./schema.gql
 * before running `npm run codegen`. Both schemas are code-first
 * (`autoSchemaFile: 'schema.gql'`), so:
 *
 *   cat ../cks-management-api/schema.gql ../cks-game-api/schema.gql \
 *       > schema.gql.merged
 *   # de-dupe shared scalars / enums by hand or via a merge tool
 *
 * Until that union surface is automated, this codegen targets whichever
 * schema.gql is committed at the root of this package.
 */
const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.gql',
  documents: 'src/operations/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        useTypeImports: true,
        scalars: {
          BigInt: 'string',
          DateTime: 'string',
        },
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
          defaultValue: false,
        },
        skipTypename: false,
        nonOptionalTypename: false,
        documentMode: 'documentNode',
        dedupeFragments: true,
      },
    },
  },
};

export default config;
