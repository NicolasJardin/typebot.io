export interface AttendantGetResponse {
  status: string
  attendants: {
    email: string
    name: string
    uuid: string
  }[]
}
