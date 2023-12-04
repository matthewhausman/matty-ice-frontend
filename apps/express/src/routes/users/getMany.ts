import type { RequestHandler } from 'express'
import { db } from '@matty-ice-app-template/db/index'

const findAndReplace = (
  cacheRef: any,
  {
    find,
    replace,
  }: {
    find: (item: any) => boolean
    replace: (item: any) => any
  },
): any => {
  if (cacheRef && find(cacheRef)) {
    return replace(cacheRef)
  }
  if (typeof cacheRef !== 'object') {
    return cacheRef
  }
  if (Array.isArray(cacheRef)) {
    return cacheRef.map(item => findAndReplace(item, { find, replace }))
  }
  if (cacheRef instanceof Object) {
    return Object.entries(cacheRef).reduce(
      (curr, [key, value]) => ({
        ...curr,
        [key]: findAndReplace(value, { find, replace }),
      }),
      {},
    )
  }
  return cacheRef
}

export function deserialize(cachedString: string) {
  const cache = JSON.parse(cachedString)

  const deserializedCacheWithBigInts = findAndReplace(cache, {
    find: data => typeof data === 'string' && data.startsWith('#bigint.'),
    replace: data => BigInt(data.replace('#bigint.', '')),
  })

  return deserializedCacheWithBigInts
}

export const validateSearchInput = (
  searcher: Record<string, any>,
  tableName: keyof typeof db._.schema,
): void => {
  const table = db._.schema[tableName]
  const tableColumns = Object.keys(table.columns)
  const searcherKeys = Object.keys(searcher)

  for (const key of searcherKeys) {
    console.log(key)
    if (key === 'and' || key === 'not' || key === 'or') {
      for (const s of searcher[key]) {
        validateSearchInput(s, tableName)
      }
      return
    }
    const parts = key.split('_')
    console.log(parts)

    if (parts.length > 2) throw Error('Too many parts')

    if (tableColumns.includes(parts[0])) {
      // col name is valid
      switch (parts[1]) {
        case 'eq':
          const col = table.columns[parts[0]]
          console.log(key, searcher[key])
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
  }
}

export const getManyUsers: RequestHandler = async (req, res) => {
  if (typeof req.query.q !== 'string') return

  try {
    validateSearchInput(deserialize(req.query.q), 'users')
  } catch (e) {
    console.error(e)
  }
  res.status(200).send([])
  return
}
