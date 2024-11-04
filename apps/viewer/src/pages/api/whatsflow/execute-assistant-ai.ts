import { getUserByTypebotId } from '@/helpers/getUserByTypebotId'
import { isNotDefined } from '@typebot.io/lib'
import { methodNotAllowed } from '@typebot.io/lib/api'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {
      assistant,
      sessionId,
      message,
      instructions,
      companyId,
      typebotId,
    } = req.body

    const user = await getUserByTypebotId(typebotId)

    if (isNotDefined(user)) {
      return res.status(404).json({ message: 'User not found' })
    }

    const url = `${process.env.WHATSFLOW_API_URL_V2}/execute-assistant-ai`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_WHATSFLOW}`,
        companyId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: assistant?.id,
        sessionId,
        content: message,
        instructions: instructions || null,
      }),
    })

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: 'Failed to fetch data from WhatsFlow API' })
    }

    const data = await response.json()

    return res.status(200).json(data)
  }
  return methodNotAllowed(res)
}

export default handler
