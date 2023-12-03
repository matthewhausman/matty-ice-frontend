import { InferInsertModel, InferSelectModel, Table, eq } from 'drizzle-orm'
import { PgColumn, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { DBQueryConfig, Operators, BinaryOperator } from 'drizzle-orm'
import { table } from 'console'

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})

type Mapped = { [Key in keyof Operators]: Operators[Key] }

export type Filter<
  T extends Table,
  Columns extends Record<string, PgColumn> = T['_']['columns'],
> = {
  [Column in keyof Columns]: {
    [Operator in keyof Operators]: Columns[Column]['_']['data']
  }
}

type Output = Filter<typeof cities>

export type CitiesSelectType = InferSelectModel<typeof cities>

export type CitiesInsertType = InferInsertModel<typeof cities>
