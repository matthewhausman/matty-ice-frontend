import type { RequestHandler } from 'express'
import { db, users } from '@matty-ice-app-template/db/index'
import {
  deserialize,
  validateSearchInput,
} from '../../utils/validateSearchInput'
import { generateWhere } from '../../utils/generateFilters'
import { UsersSearcher } from '@matty-ice-app-template/db/types'

export const getManyUsers: RequestHandler = async (req, res) => {
  if (typeof req.query.q !== 'string') return

  try {
    const q: UsersSearcher = deserialize(req.query.q)

    const searcher = validateSearchInput(q, 'users')

    if (!searcher) {
      res.status(422).send()
      return
    }

    const r = generateWhere(searcher, users, [])

    const data = db.query.users
      .findMany({
        where: r.where,
        with: r.with,
        limit: searcher.limit,
        offset: searcher.offset,
      })
      .toSQL()

    console.log(data)
  } catch (e) {
    console.error(e)
    res.status(422).send()
  }

  res.status(200).send([])
  return
}
