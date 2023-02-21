import { useCallback } from 'react'
import { Attendant } from '../interfaces/Attendant'
import { AttendantGetResponse } from '../interfaces/AttendantGetResponse'
import { Department } from '../interfaces/Department'
import { DepartmentGetResponse } from '../interfaces/DepartmentGetResponse'

export default function useTransferFormatter() {
  const formatDepartments = useCallback<
    (response: DepartmentGetResponse[]) => Department[]
  >(
    (response) =>
      response.map((data) => ({
        id: data.uuid,
        name: data.sector,
      })),
    []
  )

  const formatAttendants = useCallback<
    (response: AttendantGetResponse[]) => Attendant[]
  >(
    (response) =>
      response.map((data) => ({
        id: data.uuid,
        name: data.nome,
      })),
    []
  )

  return {
    formatDepartments,
    formatAttendants,
  }
}
