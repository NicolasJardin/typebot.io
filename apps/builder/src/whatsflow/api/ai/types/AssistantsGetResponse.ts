export type AssistantsGetResponse = {
  status: 'success' | 'error'
  assistants: {
    id: string
    model: string
    name: string
  }[]
}
