import { instance } from '@/services/api/base/instance'
import { AuthJwt } from '@/services/api/base/interfaces/AuthJwt'
import { AttendantGetResponse } from '@/services/api/transfer/interfaces/AttendantGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getAttendants = async () =>
    (
      await instance.get<AttendantGetResponse>('find-all-attendants', {
        data: {
          companyUuid: jwtDecoded?.companyUuid,
        },
        headers: jwtDecoded
          ? {
              Authorization: `Bearer ${jwtDecoded.token}`,
            }
          : undefined,
      })
    ).data

  res.status(200).json(await getAttendants())
}
