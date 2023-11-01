import { getTypebot } from '@/helpers/getTypebot'
import { methodNotAllowed } from '@typebot.io/lib/api'
import prisma from '@typebot.io/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const typebotId = req.query.typebotId as string

  if (req.method === 'PATCH') {
    const typebot = await getTypebot({
      typebotId,
    })
    if (!typebot) return res.status(404).send({ message: 'Typebot not found' })
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const updatedTypebot = await prisma.typebot.update({
      where: { id: typebotId },
      data,
    })
    return res.send({ typebot: updatedTypebot })
  }

  return methodNotAllowed(res)
}

export default handler
