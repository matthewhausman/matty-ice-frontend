import type { RequestHandler } from 'express'
import { UsersSearcher } from '@matty-ice-app-template/db/index'
import {
  deserialize,
  validateSearchInput,
} from '../../utils/validateSearchInput'

export const getManyUsers: RequestHandler = async (req, res) => {
  if (typeof req.query.q !== 'string') return

  try {
    const q: UsersSearcher = deserialize(req.query.q)
    const searcher = validateSearchInput(q, 'users')
    if (!searcher) res.status(422).send()
  } catch (e) {
    console.error(e)
    res.status(422).send()
  }

  res.status(200).send([])
  return
}
