import { NextApiRequest, NextApiResponse } from 'next'
import { isNotDefined } from '@typebot.io/lib'
import { methodNotAllowed } from '@typebot.io/lib/api'
import jwt_decode from 'jwt-decode'
import { FindTagsInContactResponse } from '@/features/whatsflow/types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const user = jwt_decode<{ id: string }>(
      process.env.TOKEN_WHATSFLOW as string
    )

    if (isNotDefined(user))
      return res.status(404).send({ message: 'User not found' })

    const url = `https://api.whatsflow.com.br/v1/find-tags-in-contact/${user.id}/${req.query.chatId}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_WHATSFLOW}`,
      },
    })

    res.status(200).json(response.json() as Promise<FindTagsInContactResponse>)
  }
  return methodNotAllowed(res)
}

export default handler
