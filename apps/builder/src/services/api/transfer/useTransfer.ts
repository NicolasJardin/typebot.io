import { useCallback } from 'react'
import { instance } from '../base/instance'
import { AttendantGetResponse } from './interfaces/AttendantGetResponse'
import { DepartmentGetResponse } from './interfaces/DepartmentGetResponse'

export default function useTransfer() {
  const getDepartments = useCallback(
    async () =>
      (await instance.get<DepartmentGetResponse[]>('ts-api/servicesector/list'))
        .data,
    []
  )

  const getAttendants = useCallback(
    async () =>
      (
        await instance.get<AttendantGetResponse[]>(
          'attendantController/listOfDatatableAttendants'
        )
      ).data,
    []
  )

  return {
    getDepartments,
    getAttendants,
  }
}
