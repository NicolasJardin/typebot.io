import { instance } from '@/whatsflow/api/base/instance'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { DevicesGetResponse } from '@/whatsflow/api/template/types/DevicesGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getDevices = async () =>
    (
      await instance.get<DevicesGetResponse>('find-all-devices-waba', {
        headers: jwtDecoded
          ? {
              companyId: jwtDecoded.companyUuid,
              Authorization: `Bearer ${jwtDecoded.token}`,
            }
          : undefined,
      })
    ).data

  res.status(200).json(await getDevices())
}
