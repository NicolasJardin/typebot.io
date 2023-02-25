import { instance } from '@/services/api/base/instance'
import { AuthJwt } from '@/services/api/base/interfaces/AuthJwt'
import { DepartmentGetResponse } from '@/services/api/transfer/interfaces/DepartmentGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getDepartments = async () =>
    (
      await instance.get<DepartmentGetResponse>('find-all-sectors', {
        data: {
          companyUuid: jwtDecoded?.companyUuid,
        },
        headers: jwtDecoded
          ? {
              Authorization: `Bearer ${jwtDecoded.token}`,
              'Content-Type': 'application/json',
            }
          : undefined,
      })
    ).data

  res.status(200).json(await getDepartments())
}
