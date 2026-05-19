// Copies a sibling API schema into ./schema.gql when running inside the
// multi-repo workspace. In CI (where the sibling API repo may be absent) this
// script silently no-ops and codegen runs against the committed schema.
import { existsSync, copyFileSync } from 'node:fs';

// Probe both the post-rename and legacy folder names so the script keeps
// working across the cks-graphql-api -> cks-game-api transition. After the
// split, CrowdyJS's schema is the union of the management-api and game-api
// schemas, so prefer the per-repo files where available.
const candidates = [
  '../cks-game-api/schema.gql',
  '../cks-graphql-api/schema.gql',
  '../web-api/schema.gql',
];
const DEST = './schema.gql';

const src = candidates.find((candidate) => existsSync(candidate));

if (src) {
  copyFileSync(src, DEST);
  console.log(`sync-schema: ${src} -> ${DEST}`);
} else {
  console.log(
    `sync-schema: ${candidates.join(' or ')} not found, using committed ${DEST}`,
  );
}
