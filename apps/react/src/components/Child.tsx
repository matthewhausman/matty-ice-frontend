'use client'

import useUsers from '../queries/users'

export default function Child() {
  const usersQuery = useUsers({ with_posts: true })
  const usersQuery2 = useUsers({
    id_asc: true,
    name_desc: true,
    id_eq: 12345,
    id_gt: 123,
    or: [
      { id_gt: 1000 },
      { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
    ],
    with_posts: {
      or: [
        { id_gt: 1000 },
        { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
      ],
    },
    limit: 20,
  })
  return <></>
}