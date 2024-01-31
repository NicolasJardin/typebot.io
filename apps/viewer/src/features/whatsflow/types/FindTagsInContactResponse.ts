export type FindTagsInContactResponse = {
  status: string
  tags: {
    title: string
    color: string
    createdAt: string
    tagUuid: string
    uuid: string
  }[]
}
