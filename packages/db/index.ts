import { drizzle } from 'drizzle-orm/node-postgres'
// import { cities } from './tables/cities'
import { Pool } from 'pg'
import {
  PgColumn,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
})

export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}))

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  metadata: jsonb('metadata'),
})

// or
const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'db_name',
})

const db = drizzle(pool, { schema: { users, profileInfo } })

const test = async () => {
  // const result = await db.query.cities.findMany({
  //   with: {},
  // })
  const r = await db.query.users.findMany({
    with: {},
  })
}
type FilterType<Column extends Record<string, PgColumn>> = {
  [Key in keyof Column]: Column[Key]['columnType']
}

export default db
