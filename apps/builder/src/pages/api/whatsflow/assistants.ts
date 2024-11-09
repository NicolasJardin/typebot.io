import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import { AssistantsGetResponse } from '@/whatsflow/api/ai/types/AssistantsGetResponse'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'
import { instanceV2 } from '@/whatsflow/api/base/instance-v2'
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

  const getAssistants = async () => {
    try {
      const data = (
        await instanceV2.get<AssistantsGetResponse>('find-all-assistant-ai', {
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

  res.status(200).json(await getAssistants())
}
