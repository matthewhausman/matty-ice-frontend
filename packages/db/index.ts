import { drizzle as d } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { relations, ExtractTablesWithRelations } from 'drizzle-orm'
import { Schema } from './types'
export { type RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'
export {
  type SQL,
  eq,
  ne,
  not,
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
} from 'drizzle-orm'

export const drizzle = d

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'db_name',
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  another_value: text('another_value').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  author_id: integer('author_id').notNull(),
})
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.author_id], references: [users.id] }),
}))

export const schema = { users, posts, usersRelations, postsRelations } as const

export const db = drizzle(pool, {
  schema,
} as const)

export type SchemaRelations = ExtractTablesWithRelations<Schema>
