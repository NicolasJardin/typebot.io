import { instance } from '@/whatsflow/api/base/instance'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { DevicesGetResponse } from '@/whatsflow/api/template/types/DevicesGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAuthenticatedUser } from '@/features/auth/helpers/getAuthenticatedUser'
import { notAuthenticated } from '@typebot.io/lib/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const user = await getAuthenticatedUser(req, res)
  if (!user) return notAuthenticated(res)

  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getIntegrations = async () => {
    try {
      const data = (
        await instance.get<DevicesGetResponse>('find-all-integration', {
          headers: jwtDecoded
            ? {
                companyId: jwtDecoded.companyUuid,
                Authorization: `Bearer ${jwtDecoded.token}`,
                typebotId: user.id,
              }
            : undefined,
        })
      ).data

      return data
    } catch (e) {
      console.error(e)
    }
  }

  res.status(200).json(await getIntegrations())
}
