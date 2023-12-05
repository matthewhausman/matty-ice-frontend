import { db } from '@matty-ice-app-template/db'

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

export const validateSearchInput = <T extends Record<string, any>>(
  searcher: T,
  tableName: keyof typeof db._.schema,
  levels?: number,
): false | T => {
  const table = db._.schema[tableName]
  const tableColumns = Object.keys(table.columns)
  const searcherKeys = Object.keys(searcher)

  for (const key of searcherKeys) {
    if (key === 'and' || key === 'not' || key === 'or') {
      for (const s of searcher[key]) {
        const result = validateSearchInput(s, tableName, (levels ?? 0) + 1)
        if (!result) return false
      }
      continue
    }
    if (key === 'limit' || key === 'offset') {
      if (typeof searcher[key] !== 'number') {
        return false
      } else {
        continue
      }
    }

    const parts = key.split('_')

    if (parts.length > 2) return false

    if (tableColumns.includes(parts[0])) {
      // col name is valid
      const col = table.columns[parts[0]]

      switch (parts[1]) {
        case 'ne':
          if (typeof searcher[key] !== col.dataType) {
            return false
          }
          break
        case 'eq':
          if (typeof searcher[key] !== col.dataType) {
            return false
          }
          break
        case 'gt':
          if (typeof searcher[key] !== col.dataType) {
            return false
          }
          break
        case 'gte':
          if (typeof searcher[key] !== col.dataType) {
            return false
          }
          break
        case 'lt':
          if (typeof searcher[key] !== col.dataType) {
            return false
          }
          break
        case 'lte':
          if (typeof searcher[key] !== col.dataType) {
            return false
          }
          break
        case 'inArray':
          if (!Array.isArray(searcher[key])) {
            return false
          }
          for (const d of searcher[key]) {
            if (typeof d !== col.dataType) {
              return false
            }
          }
          break
        case 'notInArray':
          if (!Array.isArray(searcher[key])) {
            return false
          }
          for (const d of searcher[key]) {
            if (typeof d !== col.dataType) {
              return false
            }
          }
          break
        case 'isNull':
          if (typeof searcher[key] !== 'boolean') {
            return false
          }
          break
        case 'isNotNull':
          if (typeof searcher[key] !== 'boolean') {
            return false
          }
          break
        case 'asc':
          if (typeof searcher[key] !== 'boolean') {
            return false
          }
          break
        case 'desc':
          if (typeof searcher[key] !== 'boolean') {
            return false
          }
          break
        default:
          return false
      }
    } else if ('with' === parts[0]) {
      if (!db._.schema[tableName].relations[parts[1]]) {
        return false
      }
      const result = validateSearchInput(
        searcher[key],
        parts[1] as any,
        (levels ?? 0) + 1,
      )
      if (!result) return false
    } else {
      return false
    }
  }

  return searcher
}
