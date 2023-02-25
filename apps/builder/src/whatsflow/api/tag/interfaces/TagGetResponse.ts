export interface TagGetResponse {
  status: string
  tags: {
    tagId: string
    tagName: string
    tagColor: string
  }[]
}
