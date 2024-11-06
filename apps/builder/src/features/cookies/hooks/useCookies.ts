import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { getCookie } from 'cookies-next'
import jwt_decode from 'jwt-decode'

export const jwt = getCookie('authJwt')

export function useCookies() {
  const decodedJwt =
    typeof jwt === 'string' ? jwt_decode<AuthJwt>(jwt) : undefined

  console.log({ decodedJwt, jwt })

  return {
    token: decodedJwt?.token || '',
    companyId: decodedJwt?.companyUuid || '',
  }
}
