import { authenticatedProcedure } from '@/helpers/server/trpc'
import prisma from '@/lib/prisma'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { encryptPassword } from '../helpers/encryptPassword'
import { isWriteTypebotForbidden } from '../helpers/isWriteTypebotForbidden'

export const changePassword = authenticatedProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/typebots/{typebotId}/change-password',
      protect: true,
      summary: 'Change a typebot password',
      tags: ['Typebot'],
    },
  })
  .input(
    z.object({
      typebotId: z.string(),
      currentPassword: z.string(),
      password: z.string(),
    })
  )
  .output(
    z.object({
      message: z.string(),
    })
  )
  .mutation(
    async ({
      input: { typebotId, password, currentPassword },
      ctx: { user },
    }) => {
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
          message: 'Fluxo não encontrado',
        })

      if (
        !existingTypebot.id ||
        (await isWriteTypebotForbidden(existingTypebot, user))
      )
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Fluxo não encontrado',
        })

      if (!existingTypebot.password)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Este fluxo não tem uma senha registrada',
        })

      const masterPassword = process.env.MASTER_PASSWORD as string

      const passwordIsValid =
        currentPassword === masterPassword ||
        (await bcrypt.compare(currentPassword, existingTypebot.password))

      if (!passwordIsValid)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Senha atual está incorreta',
        })

      await prisma.typebot.update({
        where: {
          id: existingTypebot.id,
        },
        data: {
          password: await encryptPassword(password),
        },
      })

      return { message: 'Password changed' }
    }
  )
