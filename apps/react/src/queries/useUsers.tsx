import { useInfiniteQuery } from '@tanstack/react-query'
import { User, UsersSearcher } from '@matty-ice-app-template/db/index.ts'
import { useRef, useState } from 'react'

export default function useUsers(vars: Omit<UsersSearcher, 'offset'>) {
  const page = useRef(1)
  return useInfiniteQuery({
    queryKey: ['users', vars] as const,
    queryFn: async ({ queryKey }) => {
      const usersSearcher = queryKey[1]

      const url = new URL(
        `${import.meta.env.VITE_API_URL}/users?q=${encodeURIComponent(
          JSON.stringify(usersSearcher),
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
