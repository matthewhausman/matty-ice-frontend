import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { cities } from './tables/cities'

const client = new Client({
  connectionString: 'postgres://user:password@host:port/db',
})

// or
// const client = new Client({
//   host: '127.0.0.1',
//   port: 5432,
//   user: 'postgres',
//   password: 'password',
//   database: 'db_name',
// })

const db = {
  client,
  tables: {
    cities,
  },
}

export default db
