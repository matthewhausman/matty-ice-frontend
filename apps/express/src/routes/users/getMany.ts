import type { RequestHandler } from 'express'
import { UsersSearcher } from '@matty-ice-app-template/db'
import { z } from 'zod'

// const genSchema = <T extends Record<string, any>>(args: T) => void
// const schema = z.object({

// }) satisfies z.ZodType<UsersSearcher>

export const getManyUsers: RequestHandler = async (req, res) => {
  console.log(req.query)
  res.status(200).send([])
  return
}
