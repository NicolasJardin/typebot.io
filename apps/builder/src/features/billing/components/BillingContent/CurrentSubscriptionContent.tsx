import {
  Text,
  HStack,
  Link,
  Spinner,
  Stack,
  Button,
  Heading,
} from '@chakra-ui/react'
import { useToast } from '@/hooks/useToast'
import { Plan } from 'db'
import React, { useState } from 'react'
import { cancelSubscriptionQuery } from './queries/cancelSubscriptionQuery'
import { PlanTag } from '../PlanTag'

type CurrentSubscriptionContentProps = {
  plan: Plan
  stripeId?: string | null
  onCancelSuccess: () => void
}

export const CurrentSubscriptionContent = ({
  plan,
  stripeId,
  onCancelSuccess,
}: CurrentSubscriptionContentProps) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [isRedirectingToBillingPortal, setIsRedirectingToBillingPortal] =
    useState(false)
  const { showToast } = useToast()

  const cancelSubscription = async () => {
    if (!stripeId) return
    setIsCancelling(true)
    const { error } = await cancelSubscriptionQuery(stripeId)
    if (error) {
      showToast({ description: error.message })
      return
    }
    onCancelSuccess()
    setIsCancelling(false)
  }

  const isSubscribed = (plan === Plan.STARTER || plan === Plan.PRO) && stripeId

  return (
    <Stack spacing="4">
      <Heading fontSize="3xl">Subscription</Heading>
      <HStack data-testid="current-subscription">
        <Text>Assinatura do espaço de trabalho atual: </Text>
        {isCancelling ? (
          <Spinner color="gray.500" size="xs" />
        ) : (
          <>
            <PlanTag plan={plan} />
            {isSubscribed && (
              <Link
                as="button"
                color="gray.500"
                textDecor="underline"
                fontSize="sm"
                onClick={cancelSubscription}
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
            <Button
              as={Link}
              href={`/api/stripe/billing-portal?stripeId=${stripeId}`}
              onClick={() => setIsRedirectingToBillingPortal(true)}
              isLoading={isRedirectingToBillingPortal}
            >
              Portal de cobrança
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  )
}
