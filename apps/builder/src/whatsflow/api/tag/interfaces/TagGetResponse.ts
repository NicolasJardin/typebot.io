export interface TagGetResponse {
  status: string
  tags: {
    color: string
    countContacts: number
    createdAt: string
    title: string
    type: null
    uuid: string
  }[]
}
