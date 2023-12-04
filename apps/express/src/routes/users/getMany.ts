import type { RequestHandler } from 'express'
import {
  deserialize,
  validateSearchInput,
  UsersSearcher,
} from '@matty-ice-app-template/db/index'

export const getManyUsers: RequestHandler = async (req, res) => {
  if (typeof req.query.q !== 'string') return

  try {
    const q: UsersSearcher = deserialize(req.query.q)
    const valid = validateSearchInput(q, 'users')
    if (!valid) res.status(422).send()
  } catch (e) {
    console.error(e)
    res.status(422).send()
  }

  res.status(200).send([])
  return
}
