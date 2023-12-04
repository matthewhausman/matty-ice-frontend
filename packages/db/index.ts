import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { GenerateSearcher } from './types'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'db_name',
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull(),
})
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}))

export const schema = { users, posts, usersRelations, postsRelations } as const

export const db = drizzle(pool, {
  schema,
} as const)

export type UsersSearcher = GenerateSearcher<typeof users>

export type User = InferSelectModel<typeof users>

const obj: UsersSearcher = {
  id_asc: true,
  name_desc: true,
  id_eq: 12345,
  id_gt: 123,
  or: [{ id_gt: 1000 }, { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] }],
  with_posts: {
    or: [
      { id_gt: 1000 },
      { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
    ],
  },
  limit: 20,
  offset: 40,
}
