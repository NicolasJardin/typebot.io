import * as Sentry from '@sentry/nextjs'
import { User } from '@typebot.io/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from './getUser'
import prisma from '@typebot.io/lib/prisma'

export const getAuthenticatedUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | undefined> => {
  const bearerToken = extractBearerToken(req)
  if (bearerToken) return authenticateByToken(bearerToken)

  const user = await getUser(req, res)

  if (!user || !('id' in user)) return
  Sentry.setUser({ id: user.id })
  return user
}

const authenticateByToken = async (
  apiToken: string
): Promise<User | undefined> => {
  if (typeof window !== 'undefined') return
  const user = (await prisma.user.findFirst({
    where: { apiTokens: { some: { token: apiToken } } },
  })) as User
  Sentry.setUser({ id: user.id })
  return user
}

const extractBearerToken = (req: NextApiRequest) =>
  req.headers['authorization']?.slice(7)
