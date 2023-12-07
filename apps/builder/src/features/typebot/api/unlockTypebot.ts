import prisma from '@/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { isWriteTypebotForbidden } from '../helpers/isWriteTypebotForbidden'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const unlockTypebot = authenticatedProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/typebots/{typebotId}/unlock',
      protect: true,
      summary: 'Unlock a typebot with a password',
      tags: ['Typebot'],
    },
  })
  .input(
    z.object({
      typebotId: z.string(),
      password: z.string(),
    })
  )
  .output(
    z.object({
      token: z.string(),
    })
  )
  .mutation(async ({ input: { typebotId, password }, ctx: { user } }) => {
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

    if (!existingTypebot.password)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This typebot does not have a password registered',
      })

    const passwordIsValid = await bcrypt.compare(
      password,
      existingTypebot.password
    )

    if (!passwordIsValid)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Password is invalid',
      })

    const secretKey = process.env.SECRET_KEY as string

    const token = jwt.sign({ typebotId }, secretKey)

    return { token }
  })
