import { Seo } from '@/components/Seo'
import { useUser } from '@/features/account/hooks/useUser'
import {
  PreCheckoutModal,
  PreCheckoutModalProps,
} from '@/features/billing/components/PreCheckoutModal'
import { FolderContent } from '@/features/folders/components/FolderContent'
import { TypebotDndProvider } from '@/features/folders/TypebotDndProvider'
import { ParentModalProvider } from '@/features/graph/providers/ParentModalProvider'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { useScopedI18n } from '@/locales'
import { Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { guessIfUserIsEuropean } from '@typebot.io/lib/pricing'
import { Plan } from '@typebot.io/prisma'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const DashboardPage = () => {
  const scopedT = useScopedI18n('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const { query } = useRouter()
  const { user } = useUser()
  const { workspace } = useWorkspace()
  const [preCheckoutPlan, setPreCheckoutPlan] =
    useState<PreCheckoutModalProps['selectedSubscription']>()

  useEffect(() => {
    const { subscribePlan, chats, storage } = query as {
      subscribePlan: Plan | undefined
      chats: string | undefined
      storage: string | undefined
    }
    if (workspace && subscribePlan && user && workspace.plan === 'FREE') {
      setIsLoading(true)
      setPreCheckoutPlan({
        plan: subscribePlan as 'PRO' | 'STARTER',
        workspaceId: workspace.id,
        additionalChats: chats ? parseInt(chats) : 0,
        additionalStorage: storage ? parseInt(storage) : 0,
        currency: guessIfUserIsEuropean() ? 'eur' : 'usd',
      })
    }
  }, [query, user, workspace])

  return (
    <Stack minH="100vh">
      <Seo title={workspace?.name ?? 'Meus typebots'} />

      {!workspace?.stripeId && (
        <ParentModalProvider>
          <PreCheckoutModal
            selectedSubscription={preCheckoutPlan}
            existingEmail={user?.email ?? undefined}
            existingCompany={workspace?.name ?? undefined}
            onClose={() => setPreCheckoutPlan(undefined)}
          />
        </ParentModalProvider>
      )}
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
