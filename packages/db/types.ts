import { Table } from 'drizzle-orm'
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
  [Column in keyof Columns]?: {
    eq?: Columns[Column]['_']['data']
    gt?: Columns[Column]['_']['data']
    gte?: Columns[Column]['_']['data']
    lt?: Columns[Column]['_']['data']
    lte?: Columns[Column]['_']['data']
    ne?: Columns[Column]['_']['data']
    inArray?: Columns[Column]['_']['data'][]
    notInArray?: Columns[Column]['_']['data'][]
    isNull?: boolean
    isNotNull?: boolean
    asc?: boolean
    desc?: boolean
  }
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

type T = typeof db._.schema

type F = keyof Parameters<DBQuery['users']['findMany']>[0]['with']

export type GenerateSearcher<T extends MyTable> = AndOrMetaFilters<T> & {
  with?: {
    [Key in keyof Parameters<
      (typeof db.query)[T['_']['name']]['findMany']
    >[0]['with']]: boolean
  }
}
