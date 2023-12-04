import { useQuery } from '@tanstack/react-query'
import { UsersSearcher } from '@matty-ice-app-template/db/index.ts'

export default function useUsers(vars: UsersSearcher) {
  return useQuery({
    queryKey: ['users', vars] as const,
    queryFn: ({ queryKey, signal, meta }) => {
      const usersSearcher = queryKey[1]
    },
  })
}
