import { ExternalLinkIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { Alert, AlertIcon, Button, Link, Stack, Text } from '@chakra-ui/react'
import { byId } from '@typebot.io/lib'
import { MakeComBlock, Webhook, WebhookOptions } from '@typebot.io/schemas'
import { useCallback, useEffect, useState } from 'react'
import { WebhookAdvancedConfigForm } from '../../webhook/components/WebhookAdvancedConfigForm'

type Props = {
  block: MakeComBlock
  onOptionsChange: (options: WebhookOptions) => void
}

export const MakeComSettings = ({
  block: { webhookId, id: blockId, options },
  onOptionsChange,
}: Props) => {
  const { webhooks, updateWebhook } = useTypebot()
  const webhook = webhooks.find(byId(webhookId))

  const [localWebhook, _setLocalWebhook] = useState(webhook)

  const setLocalWebhook = useCallback(
    async (newLocalWebhook: Webhook) => {
      _setLocalWebhook(newLocalWebhook)
      await updateWebhook(newLocalWebhook.id, newLocalWebhook)
    },
    [updateWebhook]
  )

  useEffect(() => {
    if (
      !localWebhook ||
      localWebhook.url ||
      !webhook?.url ||
      webhook.url === localWebhook.url
    )
      return
    setLocalWebhook({
      ...localWebhook,
      url: webhook?.url,
    })
  }, [webhook, localWebhook, setLocalWebhook])

  return (
    <Stack spacing={4}>
      <Alert status={localWebhook?.url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {localWebhook?.url ? (
          <>Seu cenário está configurado corretamente 🚀</>
        ) : (
          <Stack>
            <Text>Vá até Make.com para configurar este bloco:</Text>
            <Button
              as={Link}
              href="https://www.make.com/en/integrations/typebot"
              isExternal
              colorScheme="blue"
            >
              <Text mr="2">Make.com</Text> <ExternalLinkIcon />
            </Button>
          </Stack>
        )}
      </Alert>
      {localWebhook && (
        <WebhookAdvancedConfigForm
          blockId={blockId}
          webhook={localWebhook}
          options={options}
          onWebhookChange={setLocalWebhook}
          onOptionsChange={onOptionsChange}
        />
      )}
    </Stack>
  )
}
