import { instance } from '@/whatsflow/api/base/instance'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { TagCreateRequest } from '@/whatsflow/api/tag/interfaces/TagCreateRequest'
import { TagGetResponse } from '@/whatsflow/api/tag/interfaces/TagGetResponse'
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

  const companyUuid = jwtDecoded?.companyUuid

  const headers = {
    Authorization: `Bearer ${jwtDecoded?.token}`,
    typebotId: user.id,
  }

  if (req.method === 'GET') {
    const getTags = async () =>
      (
        await instance.get<TagGetResponse>('list-tags', {
          data: {
            companyUuid,
          },
          headers,
        })
      ).data

    res.status(200).json(await getTags())
  }

  if (req.method === 'POST') {
    const createTag = async () =>
      (
        await instance.post<TagCreateRequest>(
          'create-tag',
          {
            companyUuid,
            tagName: req.body.name,
            tagColor: req.body.color,
          },
          {
            headers,
          }
        )
      ).data

    res.status(201).send(await createTag())
  }
}
