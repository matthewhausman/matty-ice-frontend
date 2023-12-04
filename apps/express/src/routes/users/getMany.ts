import type { RequestHandler } from 'express'
import { db } from '@matty-ice-app-template/db'

export const getMany: RequestHandler = async (req, res) => {
  res.status(200).send([])
  return
}
