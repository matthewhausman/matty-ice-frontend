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
): void => {
  const table = db._.schema[tableName]
  const keys = Object.keys(searcher)
  const tableColumns = Object.keys(table)

  for (const key of keys) {
    if (key === 'and' || key === 'not' || key === 'or') {
      validateSearchInput(searcher[key], tableName)
      return
    }
    const parts = key.split('_')

    if (parts.length > 2) throw Error('Too many parts')

    if (tableColumns.includes(parts[0])) {
      // col name is valid
      switch (parts[1]) {
        case 'eq':
          const col = table.columns[parts[0]]
          if (typeof searcher[key] !== col.dataType) {
            throw Error('Wrong type in filter')
          }
          break
        case 'gt':
          break
        case 'gte':
          break
        case 'lt':
          break
        case 'lte':
          break
        case 'inArray':
          break
        case 'notInArray':
          break
        case 'isNull':
          break
        case 'isNotNull':
          break
        case 'asc':
          break
        case 'desc':
          break
        default:
          throw Error('No match found prior to separator')
      }
    } else if ('with' === parts[0]) {
      if (!db._.schema[tableName].relations[parts[1]]) {
        throw Error(`key invalid after separator (with: ${parts[1]})`)
      }

      validateSearchInput(searcher[key], parts[1] as any)
    }

    break
  }
}
