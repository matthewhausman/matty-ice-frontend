import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})

export type CitiesSelectType = InferSelectModel<typeof cities>

export type CitiesInsertType = InferInsertModel<typeof cities>
