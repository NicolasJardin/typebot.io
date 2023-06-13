import prisma from '@/lib/prisma'
import { getCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = getCookie('authId', { req, res }) as string | undefined

  if (!id) return null

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  })

  return user
}
