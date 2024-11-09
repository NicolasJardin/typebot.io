import { getAuthenticatedUser } from '@/features/auth/helpers/getAuthenticatedUser'
import { instance } from '@/whatsflow/api/base/instance'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { AttendantGetResponse } from '@/whatsflow/api/transfer/interfaces/AttendantGetResponse'
import { notAuthenticated } from '@typebot.io/lib/api'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const user = await getAuthenticatedUser(req, res)

  if (!user) return notAuthenticated(res)

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
              typebotId: user.id,
            }
          : undefined,
      })
    ).data

  res.status(200).json(await getAttendants())
}
