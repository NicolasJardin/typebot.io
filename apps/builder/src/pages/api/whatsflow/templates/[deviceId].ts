import { instance } from '@/whatsflow/api/base/instance'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { TemplatesGetResponse } from '@/whatsflow/api/template/types/TemplatesGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const deviceId = req.query.deviceId as string
  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getTemplates = async () => {
    try {
      const response = await instance.get<TemplatesGetResponse>(
        `find-all-template-in-device-waba/${deviceId}`,
        {
          headers: jwtDecoded
            ? {
                companyId: jwtDecoded.companyUuid,
                Authorization: `Bearer ${jwtDecoded.token}`,
              }
            : undefined,
        }
      )

      return response.data
    } catch (e) {
      console.error(e)
    }
  }

  res.status(200).json(await getTemplates())
}
