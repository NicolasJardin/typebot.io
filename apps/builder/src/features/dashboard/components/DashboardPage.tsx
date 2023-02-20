import { Seo } from '@/components/Seo'
import { useUser } from '@/features/account'
import { FolderContent, TypebotDndProvider } from '@/features/folders'
import { useWorkspace } from '@/features/workspace'
import { trpc } from '@/lib/trpc'
import { Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { Plan } from 'db'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { guessIfUserIsEuropean } from 'utils/pricing'

export const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { query, push } = useRouter()
  const { user } = useUser()
  const { workspace } = useWorkspace()
  const { mutate: createCheckoutSession } =
    trpc.billing.createCheckoutSession.useMutation({
      onSuccess: (data) => {
        push(data.checkoutUrl)
      },
    })

  useEffect(() => {
    const { subscribePlan, chats, storage } = query as {
      subscribePlan: Plan | undefined
      chats: string | undefined
      storage: string | undefined
    }
    if (workspace && subscribePlan && user && workspace.plan === 'FREE') {
      setIsLoading(true)
      createCheckoutSession({
        plan: subscribePlan as 'PRO' | 'STARTER',
        workspaceId: workspace.id,
        additionalChats: chats ? parseInt(chats) : 0,
        additionalStorage: storage ? parseInt(storage) : 0,
        returnUrl: window.location.href,
        currency: guessIfUserIsEuropean() ? 'eur' : 'usd',
        prefilledEmail: user.email ?? undefined,
      })
    }
  }, [createCheckoutSession, query, user, workspace])

  return (
    <Stack minH="100vh">
      <Seo title={workspace?.name ?? 'My typebots'} />

      <TypebotDndProvider>
        {isLoading ? (
          <VStack w="full" justifyContent="center" pt="10" spacing={6}>
            <Text>Você está sendo redirecionado...</Text>
            <Spinner />
          </VStack>
        ) : (
          <FolderContent folder={null} />
        )}
      </TypebotDndProvider>
    </Stack>
  )
}
