import prisma from '@typebot.io/lib/prisma'
import { Prisma } from '@typebot.io/prisma'

type Props<T extends Prisma.TypebotSelect> = {
  typebotId: string
  select?: T
}

export const getTypebot = async <T extends Prisma.TypebotSelect>({
  typebotId,
  select,
}: Props<T>) => {
  const typebot = await prisma.typebot.findFirst({
    where: {
      id: typebotId,
    },
    select: {
      ...select,
      id: true,
      workspaceId: true,
      collaborators: { select: { userId: true, type: true } },
    },
  })
  if (!typebot) return null

  return typebot
}
