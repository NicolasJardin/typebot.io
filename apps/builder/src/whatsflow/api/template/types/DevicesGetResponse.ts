export type DevicesGetResponse = {
  status: 'success' | 'error'
  devices: {
    name: string
    chatId: string
    id: string
  }[]
}
