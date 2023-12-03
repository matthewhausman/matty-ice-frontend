import { CitiesSelectType } from '@matty-ice-app-template/db/tables/cities'
import { useQuery } from '@tanstack/react-query'
import db from '@matty-ice-app-template/db'

export default function useCities(vars: any) {
  return useQuery({
    queryKey: ['cities'] as const,
    queryFn: () => {
      return {} as CitiesSelectType
    },
  })
}
