import { MyTable } from '@matty-ice-app-template/db/types'
import {
  RelationalQueryBuilder,
  SchemaRelations,
} from '@matty-ice-app-template/db'

const objectKeys = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj) as (keyof T)[]
}

export const generateWhere = <
  Searcher extends Record<string, any>,
  T extends MyTable,
>(
  searcher: Searcher,
  table: T,
): Parameters<
  RelationalQueryBuilder<
    SchemaRelations,
    SchemaRelations[T['_']['name']]
  >['findMany']
>[0]['where'] => {
  const keys = objectKeys(searcher)
  // for (key in keys) {
  // }
  // return (table, res) => {
  //   // return res.lt(table[])
  // }
  return undefined
}

export const generateWith = <
  Searcher extends Record<string, any>,
  T extends MyTable,
>(
  searcher: Searcher,
  table: T,
):
  | Parameters<
      RelationalQueryBuilder<
        SchemaRelations,
        SchemaRelations[T['_']['name']]
      >['findMany']
    >[0]['with']
  | undefined => {
  return undefined
}
