import prisma from '@/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { isWriteTypebotForbidden } from '../helpers/isWriteTypebotForbidden'
import jwt from 'jsonwebtoken'

export const verifyIfTypebotIsUnlocked = authenticatedProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/typebots/{typebotId}/verifyIfTypebotIsUnlocked',
      protect: true,
      summary: 'verify if a typebot is unlocked',
      tags: ['Typebot'],
    },
  })
  .input(
    z.object({
      typebotId: z.string(),
      token: z.string(),
    })
  )
  .output(
    z.object({
      unlocked: z.boolean(),
    })
  )
  .query(async ({ input: { typebotId, token }, ctx: { user } }) => {
    const existingTypebot = await prisma.typebot.findFirst({
      where: {
        id: typebotId,
      },
      include: {
        collaborators: true,
        publishedTypebot: true,
      },
    })
    if (!existingTypebot)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Typebot not found',
      })

    if (
      !existingTypebot.id ||
      (await isWriteTypebotForbidden(existingTypebot, user))
    )
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Typebot not found' })

    const secretKey = process.env.SECRET_KEY as string

    let unlocked = false

    try {
      unlocked = Boolean(jwt.verify(token, secretKey))
    } catch (e) {
      unlocked = false
    }

    return { unlocked }
  })
