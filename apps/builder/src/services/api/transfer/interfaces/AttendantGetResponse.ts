export interface AttendantGetResponse {
  status: string
  attendants: {
    user_name: string
    company_name: string
    user_uuid: string
    account_uuid: string
    activated: number
    added_in: string
    ID: number
  }[]
}
