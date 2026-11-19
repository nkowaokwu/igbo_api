# Search Tracking

**Status:** Phase 1 in progress (#847). Phase 2 is in a separate design doc.
**Author:** Deborah
**Last updated:** 2026-11-19

## Summary

Record what people search for in the dictionary so we can see which words are missing and which are searched most. Words found to be missing can later be filled in by translators and added to the dictionary.

## Background

- The search endpoints (`GET /api/v1/words`, `GET /api/v2/words`) only read from the database. A search that returns nothing leaves no record.
- Search terms are sent to Google Analytics (`src/middleware/analytics.ts`), but only for v2, only in production, and without whether the search found anything.

## Phases

A **term** is whatever someone typed into the search box. 

1. **Record searches.** Store each search, when it happened and whether it found anything.
2. **Candidates and review.** Select the missing terms worth reviewing (`noResultsFound` is true, searched often enough, not already sent or rejected) and send them into the editor platform's existing word-suggestion flow, where translators fill them in and approve them into `words`. Covered in a separate design doc (`search-tracking-phase-2.md`).

## Phase 1

### Where it lives

- `src/models/Search.ts`: the `Search` model, stored in a new `searches` collection.
- `src/controllers/utils/recordSearch.ts`: skips terms that should not be recorded (see below), normalizes the term and adds one row, following the connection pattern in `src/controllers/utils/buildDocs.ts`.
- `src/controllers/words.ts`: `getWordsFromDatabase` calls `recordSearch` for first-page searches, just before the response is sent. It waits for the save, because Cloud Functions may stop work that carries on after a response. Errors are only logged, so a failed save never breaks the search.

### What is recorded

- Website searches (requests using the main key, `isUsingMainKey`) and developer searches.
- Both English and Igbo searches, labelled by the path the API took.
- Every search, not only ones that return nothing. `noResultsFound` marks which terms are gaps, and keeping found searches gives us popularity data that cannot be collected retroactively.

### Fields

One row per search. Indexed on `normalizedTerm` + `language`, and on `searchedAt`.

| Field | Type | Example | Description |
|---|---|---|---|
| `term` | String | `Mmìrì` | Search term as typed, trimmed and with repeated spaces collapsed |
| `normalizedTerm` | String | `mmiri` | Lowercased, tone marks removed (`removeAccents.removeTones`), apostrophes stored as `’`. Used to group variants |
| `language` | `LanguageEnum` (`eng` \| `ibo`) | `ibo` | Which search path the API took |
| `source` | `SearchSourceEnum` (`igbo_api` \| `nkowaokwu`) | `nkowaokwu` | Nkọwa okwu (main key) or Igbo API developer key |
| `noResultsFound` | Boolean | `true` | Whether this search returned no results |
| `isCached` | Boolean | `false` | Whether the results came from the Redis cache instead of MongoDB |
| `cacheSource` | `CacheSourceEnum` (`redis`) | `redis` | Where cached results came from; only set when `isCached` is true |
| `searchedAt` | Date | `2026-11-02T15:32:10Z` | When the search happened |

`SearchSourceEnum` is a new enum in `src/shared/constants/SearchSourceEnum.ts`:

```ts
enum SearchSourceEnum {
  IGBO_API = 'igbo_api',
  NKOWAOKWU = 'nkowaokwu',
}
```

`CacheSourceEnum` is a new enum in `src/shared/constants/CacheSourceEnum.ts`:

```ts
enum CacheSourceEnum {
  REDIS = 'redis',
}
```

### Not recorded

- Requests for later pages of results (`skip` above 0, from `page` or `range`), so paging through results is not counted as extra searches
- Empty terms and terms with no letters
- Links (starting with `http://`, `https://` or `www.`) and email addresses
- IP addresses or anything identifying website visitors

### Known limitations

- Responses can be served from an HTTP cache without reaching the server, so repeat searches may be undercounted.
- `language` follows the API's English/Igbo guess, so a word the guess gets wrong is labelled with the wrong language.
- Until #846 is merged, Igbo words typed with a straight apostrophe (`n'isi`) return no results, so those searches are recorded with `noResultsFound` true even when the word exists.
- Search results, including empty ones, are cached in Redis for 7 days (`REDIS_CACHE_EXPIRATION`). After a word is added to the dictionary, searches for it can still be recorded as missing for up to 7 days. These rows have `isCached` true, so they can be told apart from searches that checked MongoDB.
