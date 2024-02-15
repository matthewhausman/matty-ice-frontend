'use client'

import useUsers from '../queries/useUsers'

export default function Child() {
  const usersQuery2 = useUsers({
    limit: 20,

    with_posts: {
      author_id_lte: 4000,
    },
  })
  return <></>
}
