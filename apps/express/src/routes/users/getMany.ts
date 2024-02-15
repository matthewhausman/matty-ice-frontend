import type { RequestHandler } from 'express'
import { db, eq, ne, users } from '@matty-ice-app-template/db/index'
import {
  deserialize,
  validateSearchInput,
} from '../../utils/validateSearchInput'
import { generateWhere } from '../../utils/generateFilters'
import { UsersSearcher } from '@matty-ice-app-template/db/types'

export const getManyUsers: RequestHandler = async (req, res) => {
  if (typeof req.query.q !== 'string') return

  try {
    //
    const q: UsersSearcher = deserialize(req.query.q)

    const searcher = validateSearchInput(q, 'users')

    console.log(searcher)
    if (!searcher) {
      res.status(422).send()
      return
    }

    // const t = generateWhere(searcher, users, [])

    const data = db.query.users
      .findMany({
        where: generateWhere(searcher, users, []),
        // with: generateWith(searcher, users),
        // where: (tb, { lt }) => lt(tb.name, ''),
        limit: searcher.limit,
        offset: searcher.offset,
      })
      .toSQL()
    console.log(data)
    // console.log(
    //   db.query.users
    //     .findMany({
    //       where: (table, { or }) => {
    //         return or(eq(table.id, 123), ne(table.id, 134))
    //       },
    //     })
    //     .toSQL(),
    // )
  } catch (e) {
    console.error(e)
    res.status(422).send()
  }

  res.status(200).send([])
  return
}
