import useUsers from '../queries/useUsers'

export default function Child() {
  const usersQuery2 = useUsers({
    limit: 20,
    id_asc: false,
    id_desc: true,
    not: {
      or: [
        { id_gt: 1000, id_lt: 10 },
        { and: [{ id_eq: 123 }, { id_inArray: [1, 23, 34] }] },
      ],
      and: [{ id_gt: 1000, id_lt: 10 }],
    },
    with_posts: {
      author_id_lte: 1234444,
    },
  })
  return <></>
}
