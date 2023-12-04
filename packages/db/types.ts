import { ExtractTableRelationsFromSchema, Table } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { db, schema } from './index'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type DBQuery = typeof db.query

type MyTable = Table & { _: Table['_'] & { name: keyof DBQuery } }

type BinaryFilters<
  T extends MyTable,
  Columns extends Record<string, PgColumn> = T['_']['columns'],
> = {
  [Column in keyof Columns as `${string &
    Column}_eq`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}_gt`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}_gte`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}_lt`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}_lte`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}_ne`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}_inArray`]?: Columns[Column]['_']['data'][]
} & {
  [Column in keyof Columns as `${string &
    Column}_notInArray`]?: Columns[Column]['_']['data'][]
} & {
  [Column in keyof Columns as `${string & Column}_isNull`]?: boolean
} & {
  [Column in keyof Columns as `${string & Column}_isNotNull`]?: boolean
} & {
  [Column in keyof Columns as `${string & Column}_asc`]?: boolean
} & {
  [Column in keyof Columns as `${string & Column}_desc`]?: boolean
}

// type AndOrFilters<T extends MyTable> = {
//   [Key in keyof BinaryFilters<T>]?:
//     | BinaryFilters<T>[Key]
//     | {
//         and?: BinaryFilters<T>[Key][]
//         or?: BinaryFilters<T>[Key][]
//       }
// }

// type NotFilter<T extends MyTable, PrevFilter = AndOrFilters<T>> = {
//   [Key in keyof PrevFilter]?:
//     | PrevFilter[Key]
//     | {
//         not?: PrevFilter[Key]
//       }
// }

type BinaryFiltersWithAnd = {}

type AndOrMetaFilters<
  T extends MyTable,
  PrevFilter = BinaryFilters<T>,
> = PrevFilter & {
  and?: Omit<AndOrMetaFilters<T>, 'and'>[]
  or?: Omit<AndOrMetaFilters<T>, 'or'>[]
}

type Schema = typeof schema

export type GenerateSearcher<
  T extends MyTable,
  R = ExtractTableRelationsFromSchema<Schema, T['_']['name']>,
> = AndOrMetaFilters<T> & {
  [Key in keyof Schema as Key extends keyof R
    ? `with_${string & Key}`
    : never]?: Schema[Key] extends MyTable
    ? GenerateSearcher<Schema[Key]> | boolean
    : never
} & {
  limit?: number
  offset?: number
}
