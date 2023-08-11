// Forked from https://github.com/nextauthjs/adapters/blob/main/packages/prisma/src/index.ts
import { PrismaClient, WorkspaceRole, Plan, User } from '@typebot.io/prisma'
import { createId } from '@paralleldrive/cuid2'
import { generateId } from '@typebot.io/lib'

export async function newUser(p: PrismaClient, data: User) {
  const userCheck = await p.user.findUnique({ where: { email: data.email! } })
  if (userCheck) return { error: 'userExists' }

  const user = { id: createId(), email: data.email as string }

  const token = generateId(24)

  const createdUser = await p.user.create({
    data: {
      ...data,
      id: user.id,
      apiTokens: {
        create: { name: 'Default', token: token },
      },
      workspaces: {
        create: {
          role: WorkspaceRole.ADMIN,
          workspace: {
            create: {
              name: data.name ? `${data.company}` : `My workspace`,
              plan: Plan.UNLIMITED,
            },
          },
        },
      },
      onboardingCategories: [],
    },
  })

  return {
    createdUser,
    token: token,
  }
}
