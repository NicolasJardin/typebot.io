import { isNotDefined } from '@typebot.io/lib'
import { methodNotAllowed } from '@typebot.io/lib/api'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const chatId = req.query.chatId
    const userId = req.query.userId

    if (isNotDefined(userId))
      return res.status(404).send({ message: 'User not found' })

    const url = `${process.env.WHATSFLOW_API_URL}/find-tags-in-contact/${userId}/${chatId}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_WHATSFLOW}`,
      },
    })

    const data = await response.json()

    return res.status(200).json(data)
  }
  return methodNotAllowed(res)
}

export default handler
