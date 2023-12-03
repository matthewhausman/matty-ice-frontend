import { CitiesSelectType } from '@matty-ice-app-template/db/tables/cities'
import { useQuery } from '@tanstack/react-query'
export default function useCities() {
  return useQuery({
    queryKey: ['cities'] as const,
    queryFn: () => {
      return {} as CitiesSelectType
    },
  })
}
