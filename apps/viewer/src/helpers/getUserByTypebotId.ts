import { User } from '@typebot.io/prisma'
import prisma from '@/lib/prisma'

export const getUserByTypebotId = async (
  typebotId?: string
): Promise<User | undefined> => {
  if (!typebotId) return
  return (await prisma.user.findFirst({
    where: {
      workspaces: {
        some: { workspace: { typebots: { some: { id: typebotId } } } },
      },
    },
  })) as User
}
