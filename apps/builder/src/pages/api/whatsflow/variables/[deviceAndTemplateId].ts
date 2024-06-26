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

  const [deviceId, templateId] = (
    req.query.deviceAndTemplateId as string
  ).split(',')

  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getVariables = async () => {
    try {
      const response = await instance.get<TemplatesGetResponse>(
        `find-template-variable/${deviceId}/${templateId}`,
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

  res.status(200).json(await getVariables())
}
