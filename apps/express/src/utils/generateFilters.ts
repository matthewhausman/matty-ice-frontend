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
  SQL,
  not,
  db,
  schema,
} from '@matty-ice-app-template/db'

const objectKeys = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj) as (keyof T)[]
}

export const generateWhereHelper = <
  S extends Record<string, any>,
  T extends MyTable,
  W =
    | Parameters<
        RelationalQueryBuilder<
          SchemaRelations,
          SchemaRelations[T['_']['name']]
        >['findMany']
      >[0]['with']
    | undefined,
>(
  searcher: S,
  table: T,
): {
  where: readonly any[]
  with: W
} => {
  const keys = objectKeys(searcher)

  console.log(Reflect.ownKeys(table))

  const s = Reflect.ownKeys(table).find(
    key => key.toString() === 'Symbol(drizzle:Columns)',
  )

  const tableColumns = objectKeys(table[s])

  const curFilters: any[] = []

  let withArg: Record<string, any> = {}

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (typeof key !== 'string') throw Error('key is not type string')

    if (key === 'limit' || key === 'offset') {
      continue
    }

    const parts = key.split('_')

    if (['and', 'not', 'or'].includes(key)) {
      if (key === 'and') {
        const arr = searcher[key] as any[]
        const cond = []
        arr.forEach(v => {
          cond.push(...generateWhereHelper(v, table).where)
        })
        curFilters.push(and(...cond))
      } else if (key === 'or') {
        const arr = searcher[key] as any[]
        const cond = []
        arr.forEach(v => {
          cond.push(and(...generateWhereHelper(v, table).where))
        })
        curFilters.push(or(...cond))
      } else {
        const t: readonly any[] = generateWhereHelper(
          searcher[key],
          table,
        ).where
        curFilters.push(not(and(...t)))
      }
      continue
    }

    const withoutLast = key.split('_')
    withoutLast.pop()
    const colName = withoutLast.join('_')

    if (tableColumns.includes(colName)) {
      switch (parts[parts.length - 1]) {
        case 'ne':
          curFilters.push(ne(table[colName], searcher[key]))
          break
        case 'eq':
          curFilters.push(eq(table[colName], searcher[key]))
          break
        case 'gt':
          curFilters.push(gt(table[colName], searcher[key]))
          break
        case 'gte':
          curFilters.push(gte(table[colName], searcher[key]))
          break
        case 'lt':
          curFilters.push(lt(table[colName], searcher[key]))
          break
        case 'lte':
          curFilters.push(lte(table[colName], searcher[key]))
          break
        case 'inArray':
          curFilters.push(inArray(table[colName], searcher[key]))
          break
        case 'notInArray':
          curFilters.push(notInArray(table[colName], searcher[key]))
          break
        case 'isNull':
          if (searcher[key]) {
            curFilters.push(isNull(table[colName]))
          }
          break
        case 'isNotNull':
          if (searcher[key]) {
            curFilters.push(isNotNull(table[colName]))
          }
          break
        case 'asc':
          if (searcher[key]) {
            curFilters.push(asc(table[colName]))
          }
          break
        case 'desc':
          if (searcher[key]) {
            curFilters.push(desc(table[colName]))
          }
          break
        default:
          throw Error()
      }
    } else if (parts[0] === 'with') {
      const withoutFirst = key.split('_')
      withoutFirst.shift()
      const tableName = withoutFirst.join('_')

      console.log(searcher[key])
      withArg = {
        ...withArg,
        [tableName as keyof typeof db._.schema]:
          typeof searcher[key] === 'boolean'
            ? true
            : generateWhere(searcher[key], schema[tableName], []),
      }
    } else {
      console.error('unimplemented', key)
    }
  }

  return { where: curFilters, with: withArg as W }
}

export const generateWhere = <
  Searcher extends Record<string, any>,
  T extends MyTable,
  With = Parameters<
    RelationalQueryBuilder<
      SchemaRelations,
      SchemaRelations[T['_']['name']]
    >['findMany']
  >[0]['with'],
>(
  searcher: Searcher,
  table: T,
  filters: any[],
): {
  where: SQL
  with: With
} => {
  const ops = generateWhereHelper(searcher, table)
  const ret = and(...ops.where)
  return { where: ret, with: ops.with as With }
}
