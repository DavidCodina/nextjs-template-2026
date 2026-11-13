// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
// https://github.com/TanStack/table/blob/main/packages/match-sorter-utils/src/index.ts#L78
// https://github.com/kentcdodds/match-sorter
import { rankItem } from '@tanstack/match-sorter-utils'

import type { FilterFn } from '@tanstack/react-table'

///////////////////////////////////////////////////////////////////////////
//
// Initially, fuzzyFilter didn't seem to handle numbers well. In case you're wondering
// where this came from, it's the example used by the docs and the code sandbox:
//
//   https://tanstack.com/table/v8/docs/api/features/filters#filter-meta
//   https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed=&file=/src/main.tsx:3580-4279
//
//   const fuzzyFilter = (row, columnId, value, addMeta) => {
//     const itemRank = rankItem(row.getValue(columnId), value)
//     addMeta({ itemRank })  // Store the itemRank info
//     return itemRank.passed // Return if the item should be filtered in/out
//   }
//
// For example, using 54 somehow includes the David Codina row because of it's date:
// "date_of_birth":"1978-05-09T23:04:32Z"
//
// Fuzzy search algorithms, like the one used in Tanstack Table, are designed to find matches
// that are “close” to the search term, rather than exact matches. This means that they can
// sometimes return unexpected results because they consider a match based on a pattern
// of characters that may be spread out across the string. For example, '51234' satisfies
// the criteria of 54. This is probably not what we want. The same happens with letters...
//
/////////////////////////
//
// Something about fuzzyFilter is really weird. Maybe I just don't understand
// what it's intended to do. In any case, suppose we filtered for 'dav'
// This would actually respond back with the following records:
//
//   -	1  David	daveman@gmail.com
//   - 39 Denice	dpieroni12@bravesites.com
//
// It's unclear to me why record 39 is being returned. It seems to be because
// it has 'rav'. Maybe that's the fuzzy part. Ultimately, I need to learn more
// about fuzzy searches: https://www.geeksforgeeks.org/fuzzy-search-in-javascript/
//
// It turns out that fuzzy search is exactly that: https://www.geeksforgeeks.org/fuzzy-search-in-javascript/
// Fuzzy searching matches the meaning, not necessarily the precise wording or specified phrases.
// It performs something the same as full-text search against data to see likely misspellings
// and approximate string matching. it’s a very powerful tool that takes into consideration
// the context of the phrase you wish to look.
//
// So it's a feature not a bug. Nonetheless, I prefer an exact search.
//
///////////////////////////////////////////////////////////////////////////

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // This is a cutoff value that determines what is considered a match.
  // Only items that score above this threshold would be considered a good match.
  // However, experimentation has shown that anything above 4 is too strict.
  // For example, '9', won't match 'May 9, 1978'. Presumbably, 5 and above are
  // looking for more complete substrings. The problem is that there's no documtation
  // on this, so it's just kind of a guess. That's why I tend to prefer 'includesString'.
  const itemRank = rankItem(row.getValue(columnId), value, { threshold: 4 })

  addMeta({ itemRank }) // Store the itemRank info
  const passed = itemRank.passed // => passed: rank >= options.threshold,
  return passed // Return if the item should be filtered in/out
}
