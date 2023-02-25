export interface DepartmentGetResponse {
  sectors: {
    sector: string
    uuid: string
    total: number
  }[]
  status: string
}
