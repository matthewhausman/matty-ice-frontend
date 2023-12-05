import { MyTable } from '@matty-ice-app-template/db/types'
import {
  RelationalQueryBuilder,
  SchemaRelations,
  eq,
  lt,
  lte,
  gt,
  gte,
  or,
  and,
  inArray,
  notInArray,
  isNotNull,
  isNull,
  asc,
  desc,
  ne,
} from '@matty-ice-app-template/db'

const objectKeys = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj) as (keyof T)[]
}

type Where<T extends MyTable> = Parameters<
  RelationalQueryBuilder<
    SchemaRelations,
    SchemaRelations[T['_']['name']]
  >['findMany']
>[0]['where']

export const generateWhereHelper = <
  Searcher extends Record<string, any>,
  T extends MyTable,
>(
  searcher: Searcher,
  table: T,
  filters: any[],
): readonly any[] => {
  const keys = objectKeys(searcher)

  const s = Reflect.ownKeys(table).find(
    key => key.toString() === 'Symbol(drizzle:Columns)',
  )

  const tableColumns = objectKeys(table[s])

  const curFilters: any[] = []

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (typeof key !== 'string') throw Error('key is not type string')

    if (key === 'limit' || key === 'offset') {
      continue
    }

    const parts = key.split('_')

    if (key === 'and' || key === 'not' || key === 'or') {
      if (key === 'and') {
        const arr = searcher[key] as any[]
        arr.forEach(v => {
          curFilters.push(
            and(...generateWhereHelper(searcher[key], table, curFilters)),
          )
        })
      } else if (key === 'or') {
        const arr = searcher[key] as any[]
        arr.forEach(v => {
          curFilters.push(
            or(...generateWhereHelper(searcher[key], table, curFilters)),
          )
        })
      } else {
        // hold off on not for now
        continue
      }
    } else if (tableColumns.includes(parts[0])) {
      switch (parts[1]) {
        case 'ne':
          curFilters.push(ne(table[parts[0]], searcher[key]))
          break
        case 'eq':
          curFilters.push(eq(table[parts[0]], searcher[key]))
          break
        case 'gt':
          curFilters.push(gt(table[parts[0]], searcher[key]))
          break
        case 'gte':
          curFilters.push(gte(table[parts[0]], searcher[key]))
          break
        case 'lt':
          curFilters.push(lt(table[parts[0]], searcher[key]))
          break
        case 'lte':
          curFilters.push(lte(table[parts[0]], searcher[key]))
          break
        case 'inArray':
          curFilters.push(inArray(table[parts[0]], searcher[key]))
          break
        case 'notInArray':
          curFilters.push(notInArray(table[parts[0]], searcher[key]))
          break
        case 'isNull':
          if (searcher[key]) {
            curFilters.push(isNull(table[parts[0]]))
          }
          break
        case 'isNotNull':
          if (searcher[key]) {
            curFilters.push(isNotNull(table[parts[0]]))
          }
          break
        case 'asc':
          if (searcher[key]) {
            curFilters.push(asc(table[parts[0]]))
          }
          break
        case 'desc':
          if (searcher[key]) {
            curFilters.push(desc(table[parts[0]]))
          }
          break
        default:
          throw Error()
      }
    } else if (parts[0] === 'with') {
      continue
    } else {
      console.error('unimplemented', key)
    }
  }
  filters.push(curFilters)
  return filters
}

export const generateWhere = <
  Searcher extends Record<string, any>,
  T extends MyTable,
>(
  searcher: Searcher,
  table: T,
  filters: any[],
): Where<T> => {
  const ops = generateWhereHelper(searcher, table, filters)
  const ret = and(...ops)
  return ret
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
