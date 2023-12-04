import { useInfiniteQuery } from '@tanstack/react-query'
import { User, UsersSearcher } from '@matty-ice-app-template/db/index.ts'
import { useState } from 'react'

export default function useUsers(vars: Omit<UsersSearcher, 'offset'>) {
  const [page, setPage] = useState(1)
  return useInfiniteQuery({
    queryKey: ['users', vars] as const,
    queryFn: ({ queryKey }) => {
      const usersSearcher = queryKey[1]

      return { data: [{ id: 2, name: '123' }], total: 100 } as {
        data: User[]
        total: number
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      setPage(p => p + 1)
      return (vars.limit ?? 12) * allPages.length + (vars.limit ?? 12) <
        lastPage.total
        ? allPages.length + 1
        : undefined
    },
    getPreviousPageParam: () => {
      setPage(p => p - 1)
      return page - 1
    },
  })
}
