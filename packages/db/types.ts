import {
  ExtractTableRelationsFromSchema,
  InferSelectModel,
  Table,
} from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { db, schema, users } from './index'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type DBQuery = typeof db.query

export type MyTable = Table & { _: Table['_'] & { name: keyof DBQuery } }

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

type AndOrMetaFilters<
  T extends MyTable,
  PrevFilter = BinaryFilters<T>,
> = PrevFilter & {
  and?: Prettify<Omit<AndOrMetaFilters<T>, 'and'>>[]
  or?: Prettify<Omit<AndOrMetaFilters<T>, 'or'>>[]
}

export type Schema = typeof schema

export type GenerateSearcher<
  T extends MyTable,
  Columns extends Record<string, PgColumn> = T['_']['columns'],
  R = ExtractTableRelationsFromSchema<Schema, T['_']['name']>,
> = Prettify<
  AndOrMetaFilters<T> & {
    [Key in keyof Schema as Key extends keyof R
      ? `with_${string & Key}`
      : never]?: Schema[Key] extends MyTable
      ? GenerateSearcher<Schema[Key]> | boolean
      : never
  } & {
    limit?: number
    offset?: number
    columns?: {
      [K in keyof Columns]: boolean
    }
  }
>

export type User = InferSelectModel<typeof users>

export type UsersSearcher = GenerateSearcher<typeof users>
