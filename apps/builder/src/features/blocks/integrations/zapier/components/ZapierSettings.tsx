import { Alert, AlertIcon, Button, Link, Stack, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor'
import { Webhook, WebhookOptions, ZapierBlock } from 'models'
import React, { useCallback, useEffect, useState } from 'react'
import { byId, env } from 'utils'
import { WebhookAdvancedConfigForm } from '../../webhook/components/WebhookAdvancedConfigForm'
import { useDebouncedCallback } from 'use-debounce'

const debounceWebhookTimeout = 2000

type Props = {
  block: ZapierBlock
  onOptionsChange: (options: WebhookOptions) => void
}

export const ZapierSettings = ({
  block: { webhookId, id: blockId, options },
  onOptionsChange,
}: Props) => {
  const { webhooks, updateWebhook } = useTypebot()
  const webhook = webhooks.find(byId(webhookId))

  const [localWebhook, _setLocalWebhook] = useState(webhook)

  const updateWebhookDebounced = useDebouncedCallback(
    async (newLocalWebhook) => {
      await updateWebhook(newLocalWebhook.id, newLocalWebhook)
    },
    env('E2E_TEST') === 'true' ? 0 : debounceWebhookTimeout
  )

  const setLocalWebhook = useCallback(
    (newLocalWebhook: Webhook) => {
      _setLocalWebhook(newLocalWebhook)
      updateWebhookDebounced(newLocalWebhook)
    },
    [updateWebhookDebounced]
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

  useEffect(
    () => () => {
      updateWebhookDebounced.flush()
    },
    [updateWebhookDebounced]
  )

  return (
    <Stack spacing={4}>
      <Alert status={localWebhook?.url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {localWebhook?.url ? (
          <>Seu zap está configurado corretamente 🚀</>
        ) : (
          <Stack>
            <Text>Vá até o Zapier para configurar este bloco:</Text>
            <Button
              as={Link}
              href="https://zapier.com/apps/typebot/integrations"
              isExternal
              colorScheme="blue"
            >
              <Text mr="2">Zapier</Text> <ExternalLinkIcon />
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
