import { ExtractTableRelationsFromSchema, Table } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { db, schema } from './index'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type DBQuery = typeof db.query

type MyTable = Table & { _: Table['_'] & { name: keyof DBQuery } }

type BinaryFilters<
  T extends MyTable,
  Columns extends Record<string, PgColumn> = T['_']['columns'],
> = {
  [Column in keyof Columns as `${string &
    Column}:eq`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:gt`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:gte`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:lt`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:lte`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:ne`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:inArray`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string &
    Column}:notInArray`]?: Columns[Column]['_']['data']
} & {
  [Column in keyof Columns as `${string & Column}:isNull`]?: boolean
} & {
  [Column in keyof Columns as `${string & Column}:isNotNull`]?: boolean
} & {
  [Column in keyof Columns as `${string & Column}:asc`]?: boolean
} & {
  [Column in keyof Columns as `${string & Column}:desc`]?: boolean
}

type AndOrFilters<T extends MyTable> = {
  [Key in keyof BinaryFilters<T>]?: Prettify<BinaryFilters<T>[Key]> & {
    and?: Prettify<BinaryFilters<T>[Key]>[]
    or?: Prettify<BinaryFilters<T>[Key]>[]
  }
}

type NotFilter<T extends MyTable> = {
  [Key in keyof AndOrFilters<T>]?: Prettify<AndOrFilters<T>[Key]> & {
    not?: Prettify<AndOrFilters<T>[Key]>
  }
}

type AndOrMetaFilters<T extends MyTable> = Prettify<NotFilter<T>> & {
  and?: Prettify<NotFilter<T>>[]
  or?: Prettify<NotFilter<T>>[]
}

type Schema = typeof schema

export type GenerateSearcher<
  T extends MyTable,
  R = ExtractTableRelationsFromSchema<Schema, T['_']['name']>,
> = AndOrMetaFilters<T> & {
  // with?: {
  //   [Key in keyof Schema as Key extends keyof R
  //     ? Key
  //     : never]: Schema[Key] extends MyTable
  //     ? GenerateSearcher<Schema[Key]>
  //     : never
  // }
  [Key in keyof Schema as Key extends keyof R
    ? `with:${string & Key}`
    : never]?: Schema[Key] extends MyTable
    ? GenerateSearcher<Schema[Key]> | boolean
    : never
}
