import { getCookie } from 'cookies-next'
import jwt_decode from 'jwt-decode'
import { useCallback, useMemo } from 'react'
import { instance } from '../base/instance'
import { AuthJwt } from '../base/interfaces/AuthJwt'
import { AttendantGetResponse } from './interfaces/AttendantGetResponse'
import { DepartmentGetResponse } from './interfaces/DepartmentGetResponse'

export default function useTransfer() {
  const jwt = getCookie('authJwt')

  const companyUuid = useMemo(
    () =>
      typeof jwt === 'string'
        ? jwt_decode<AuthJwt>(jwt).companyUuid
        : undefined,
    [jwt]
  )

  const getDepartments = useCallback(
    async () =>
      (
        await instance.get<DepartmentGetResponse[]>('find-all-sectors', {
          params: {
            companyUuid,
          },
        })
      ).data,
    [companyUuid]
  )

  const getAttendants = useCallback(
    async () =>
      (
        await instance.get<AttendantGetResponse[]>('find-all-attendants', {
          params: {
            companyUuid,
          },
        })
      ).data,
    [companyUuid]
  )

  return {
    getDepartments,
    getAttendants,
  }
}
