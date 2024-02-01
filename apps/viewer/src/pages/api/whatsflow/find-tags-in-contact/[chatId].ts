import { NextApiRequest, NextApiResponse } from 'next'
import { methodNotAllowed } from '@typebot.io/lib/api'
import { FindTagsInContactResponse } from '@/features/whatsflow/types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const url = `${process.env.WHATSFLOW_API_URL}/find-tags-in-contact/[ID DA CONTA DO TYPEBOT]/[VARIAVEL {{chatId}} DO FLUXO]`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_WHATSFLOW}`,
      },
    })

    const data = await response.json()

    return res.status(200).json(data as Promise<FindTagsInContactResponse>)
  }
  return methodNotAllowed(res)
}

export default handler
