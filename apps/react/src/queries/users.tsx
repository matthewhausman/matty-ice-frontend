import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { User, UsersSearcher } from '@matty-ice-app-template/db/index.ts'

export default function useUsers(vars: Omit<UsersSearcher, 'offset'>) {
  const d = useInfiniteQuery({
    queryKey: ['users', vars] as const,
    queryFn: ({ queryKey, pageParam = 1 }) => {
      const usersSearcher = queryKey[1]

      return [{ id: 2, name: '123' }] as User[]
    },
    initialPageParam: 1,
    getNextPageParam: () => {
      return 2
    },
    getPreviousPageParam: () => {
      return 3
    },
  })
}
