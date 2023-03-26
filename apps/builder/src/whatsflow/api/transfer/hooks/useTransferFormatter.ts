import { useCallback } from 'react'
import { Attendant } from '../interfaces/Attendant'
import { AttendantGetResponse } from '../interfaces/AttendantGetResponse'
import { Department } from '../interfaces/Department'
import { DepartmentGetResponse } from '../interfaces/DepartmentGetResponse'

export default function useTransferFormatter() {
  const formatDepartments = useCallback<
    (response: DepartmentGetResponse | undefined) => Department[]
  >(
    (response) =>
      response?.sectors.map((data) => ({
        id: data.uuid,
        name: data.sector,
      })) || [],
    []
  )

  const formatAttendants = useCallback<
    (response: AttendantGetResponse | undefined) => Attendant[]
  >(
    (response) =>
      response?.attendants.map((data) => ({
        id: data.uuid,
        name: data.name,
      })) || [],
    []
  )

  return {
    formatDepartments,
    formatAttendants,
  }
}
