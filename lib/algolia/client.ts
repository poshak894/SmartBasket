import { algoliasearch } from "algoliasearch";

export const algoliaClient =
  process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_KEY
    ? algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY)
    : null;
