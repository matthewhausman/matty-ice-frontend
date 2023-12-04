import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import {
  DBQueryConfig,
  ExtractTableRelationsFromSchema,
  relations,
  ExtractTablesWithRelations,
} from 'drizzle-orm'
import { MyTable, Schema } from './types'
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'

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

type F = ExtractTablesWithRelations<Schema>

RelationalQueryBuilder<F, F['posts']>

export const generateWhere = <
  Searcher extends Record<string, any>,
  T extends MyTable,
>(
  searcher: Searcher,
  table: T,
):
  | Parameters<
      RelationalQueryBuilder<F, F[T['_']['name']]>['findMany']
    >[0]['where']
  | undefined => {
  return undefined
}
