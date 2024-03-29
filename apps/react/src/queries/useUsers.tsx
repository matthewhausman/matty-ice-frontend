import { useInfiniteQuery } from '@tanstack/react-query'
import { User, UsersSearcher } from '@matty-ice-app-template/db/types.ts'
import { useRef } from 'react'

/**
 * @function getReferenceKey
 *
 * @description
 * get the reference key for the circular value
 *
 * @param keys the keys to build the reference key from
 * @param cutoff the maximum number of keys to include
 * @returns the reference key
 */
function getReferenceKey(keys: string[], cutoff: number) {
  return keys.slice(0, cutoff).join('.') || '.'
}

/**
 * @function getCutoff
 *
 * @description
 * faster `Array.prototype.indexOf` implementation build for slicing / splicing
 *
 * @param array the array to match the value in
 * @param value the value to match
 * @returns the matching index, or -1
 */
function getCutoff(array: any[], value: any) {
  const { length } = array

  for (let index = 0; index < length; ++index) {
    if (array[index] === value) {
      return index + 1
    }
  }

  return 0
}

type StandardReplacer = (key: string, value: any) => any
type CircularReplacer = (key: string, value: any, referenceKey: string) => any

/**
 * @function createReplacer
 *
 * @description
 * create a replacer method that handles circular values
 *
 * @param [replacer] a custom replacer to use for non-circular values
 * @param [circularReplacer] a custom replacer to use for circular methods
 * @returns the value to stringify
 */
function createReplacer(
  replacer?: StandardReplacer | null | undefined,
  circularReplacer?: CircularReplacer | null | undefined,
): StandardReplacer {
  const hasReplacer = typeof replacer === 'function'
  const hasCircularReplacer = typeof circularReplacer === 'function'

  const cache: any[] = []
  const keys: string[] = []

  return function replace(this: any, key: string, value: any) {
    if (typeof value === 'object') {
      if (cache.length) {
        const thisCutoff = getCutoff(cache, this)

        if (thisCutoff === 0) {
          cache[cache.length] = this
        } else {
          cache.splice(thisCutoff)
          keys.splice(thisCutoff)
        }

        keys[keys.length] = key

        const valueCutoff = getCutoff(cache, value)

        if (valueCutoff !== 0) {
          return hasCircularReplacer
            ? circularReplacer.call(
                this,
                key,
                value,
                getReferenceKey(keys, valueCutoff),
              )
            : `[ref=${getReferenceKey(keys, valueCutoff)}]`
        }
      } else {
        cache[0] = value
        keys[0] = key
      }
    }

    return hasReplacer ? replacer.call(this, key, value) : value
  }
}

/**
 * @function stringify
 *
 * @description
 * stringifier that handles circular values
 * Forked from https://github.com/planttheidea/fast-stringify
 *
 * @param value to stringify
 * @param [replacer] a custom replacer function for handling standard values
 * @param [indent] the number of spaces to indent the output by
 * @param [circularReplacer] a custom replacer function for handling circular values
 * @returns the stringified output
 */
export function serialize(
  value: any,
  replacer?: StandardReplacer | null | undefined,
  indent?: number | null | undefined,
  circularReplacer?: CircularReplacer | null | undefined,
) {
  return JSON.stringify(
    value,
    createReplacer((key, value_) => {
      const value =
        typeof value_ === 'bigint' ? `#bigint.${value_.toString()}` : value_
      return replacer?.(key, value) || value
    }, circularReplacer),
    indent ?? undefined,
  )
}

export default function useUsers(vars: Omit<UsersSearcher, 'offset'>) {
  const page = useRef(1)
  return useInfiniteQuery({
    queryKey: ['users', { ...vars } satisfies UsersSearcher] as const,
    queryFn: async ({ queryKey, pageParam }) => {
      const usersSearcher = queryKey[1]

      const url = new URL(
        `${import.meta.env.VITE_API_URL}/users?q=${encodeURIComponent(
          serialize(usersSearcher),
        )}`,
      )

      await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return { data: [{ id: 2, name: '123' }], total: 100 } as {
        data: User[]
        total: number
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // setPage(p => p + 1)
      const nextP =
        (vars.limit ?? 12) * allPages.length + (vars.limit ?? 12) <
        lastPage.total
          ? allPages.length + 1
          : undefined

      if (nextP !== undefined) {
        page.current = page.current + 1
      }
      return nextP
    },
    getPreviousPageParam: () => {
      // setPage(p => p - 1)
      page.current = Math.max(page.current - 1, 1)
      return page.current
    },
  })
}
