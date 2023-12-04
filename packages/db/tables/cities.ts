import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { GenerateSearcher } from '../types'
import { Table, relations } from 'drizzle-orm'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'

// import { GenerateFilters, GenerateSorts } from '../types'

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

export const db = drizzle(pool, {
  schema: { users, posts, usersRelations, postsRelations },
})

const post = db.query.users.findFirst({
  with: {
    posts: {},
  },
})

type T = typeof db.query

type DBQuery = typeof db.query
// type Test = DBQuery['']

type GenerateWith<T extends Table> = {
  key: keyof typeof db.query
}

// type T = Parameters<typeof db.query.users.findFirst>[0]['with']

export type CityFilter = GenerateSearcher<typeof users>

const d: CityFilter = {
  name: {
    inArray: ['123', '123'],
    eq: '123',
    asc: true,
  },
  with: {
    with: {
      posts: {},
    },
  },
}
