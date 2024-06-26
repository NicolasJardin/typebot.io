export type VariablesGetResponse = {
  status: 'success' | 'error'
  variables: {
    type: string
    format: 'audio' | 'video' | 'image' | 'document'
    example: string
  }[]
}
