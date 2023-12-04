import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { GenerateSearcher } from './types'

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

export const validateSearchInput = (
  searcher: Record<string, any>,
  tableName: keyof typeof db._.schema,
) => {
  const keys = Object.keys(searcher)
  const allowedKeys = Object.keys(db._.schema[tableName])
  allowedKeys.push('with')

  for (const key of keys) {
    const parts = key.split('_')
    if (!allowedKeys.includes(parts[0])) {
      throw Error(`key invalid prior to separator (${parts[0]})`)
    }
    if (parts[0] === 'with') {
      if (!db._.schema[tableName].relations[parts[1]]) {
        throw Error(`key invalid after separator (with: ${parts[1]})`)
      }
    }
  }
}
