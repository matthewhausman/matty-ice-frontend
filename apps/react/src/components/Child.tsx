'use client'

import useUsers from '../queries/useUsers'

export default function Child() {
  const usersQuery2 = useUsers({
    limit: 20,
    not: {
      or: [
        { id_gt: 1000, id_lt: 10, another_value_asc: true },
        { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
      ],
      and: [{ id_gt: 1000, id_lt: 10 }],
    },
  })
  return <></>
}
