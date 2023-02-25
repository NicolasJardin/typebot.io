import { instance } from '@/whatsflow/api/base/instance'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { TagGetResponse } from '@/whatsflow/api/tag/interfaces/TagGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authJwt = req.cookies['authJwt']

  const jwtDecoded = authJwt ? jwt_decode<AuthJwt>(authJwt) : undefined

  const getTags = async () =>
    (
      await instance.get<TagGetResponse>('list-tags', {
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

  res.status(200).json(await getTags())
}
