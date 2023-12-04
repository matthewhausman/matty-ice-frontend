import type { RequestHandler } from 'express'
import { UsersSearcher } from '@matty-ice-app-template/db/index'
import { validateSearchInput } from '@matty-ice-app-template/db/index'

export const getManyUsers: RequestHandler = async (req, res) => {
  if (typeof req.query.q !== 'string') return
  const searchParams = JSON.parse(req.query.q) as UsersSearcher
  validateSearchInput(searchParams, 'users')
  res.status(200).send([])
  return
}
