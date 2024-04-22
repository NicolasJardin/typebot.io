import prisma from '@/lib/prisma'

type Props = {
  id: string
}

export const findPublicTypebotById = ({ id }: Props) =>
  prisma.publicTypebot.findFirst({
    where: { typebot: { id } },
    select: {
      groups: true,
      edges: true,
      settings: true,
      theme: true,
      variables: true,
      typebotId: true,
      typebot: {
        select: {
          publicId: true,
          isArchived: true,
          isClosed: true,
          workspace: {
            select: {
              id: true,
              plan: true,
              additionalChatsIndex: true,
              customChatsLimit: true,
              isQuarantined: true,
              isSuspended: true,
            },
          },
        },
      },
    },
  })
