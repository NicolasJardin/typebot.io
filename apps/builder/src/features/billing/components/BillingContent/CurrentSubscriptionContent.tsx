import { Text, HStack, Link, Spinner, Stack, Heading } from '@chakra-ui/react'
import { useToast } from '@/hooks/useToast'
import { Plan } from 'db'
import React from 'react'
import { PlanTag } from '../PlanTag'
import { BillingPortalButton } from './BillingPortalButton'
import { trpc } from '@/lib/trpc'
import { Workspace } from 'models'

type CurrentSubscriptionContentProps = {
  workspace: Pick<Workspace, 'id' | 'plan' | 'stripeId'>
  onCancelSuccess: () => void
}

export const CurrentSubscriptionContent = ({
  workspace,
  onCancelSuccess,
}: CurrentSubscriptionContentProps) => {
  const { showToast } = useToast()

  const { mutate: cancelSubscription, isLoading: isCancelling } =
    trpc.billing.cancelSubscription.useMutation({
      onError: (error) => {
        showToast({
          description: error.message,
        })
      },
      onSuccess: onCancelSuccess,
    })

  const isSubscribed =
    (workspace.plan === Plan.STARTER || workspace.plan === Plan.PRO) &&
    workspace.stripeId

  return (
    <Stack spacing="4">
      <Heading fontSize="3xl">Subscription</Heading>
      <HStack data-testid="current-subscription">
        <Text>Assinatura do espaço de trabalho atual: </Text>
        {isCancelling ? (
          <Spinner color="gray.500" size="xs" />
        ) : (
          <>
            <PlanTag plan={workspace.plan} />
            {isSubscribed && (
              <Link
                as="button"
                color="gray.500"
                textDecor="underline"
                fontSize="sm"
                onClick={() =>
                  cancelSubscription({ workspaceId: workspace.id })
                }
              >
                Cancelar minha assinatura
              </Link>
            )}
          </>
        )}
      </HStack>

      {isSubscribed && !isCancelling && (
        <>
          <Stack spacing="4">
            <Text fontSize="sm">
              Precisa alterar o método de pagamento ou as informações de
              cobrança? Dirija-se a seu portal de cobrança:
            </Text>
            <BillingPortalButton workspaceId={workspace.id} />
          </Stack>
        </>
      )}
    </Stack>
  )
}
