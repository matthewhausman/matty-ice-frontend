import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

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

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'db_name',
})

const db = drizzle(pool, { schema: { users, profileInfo } })

export default db
