import { type App } from '../../server'
import type { RequestHandler } from 'express'
import { CitiesSelectType } from '@matty-ice-app-template/db/tables/cities'

const getMany: RequestHandler = (req, res) => {
  return {} as CitiesSelectType
}
