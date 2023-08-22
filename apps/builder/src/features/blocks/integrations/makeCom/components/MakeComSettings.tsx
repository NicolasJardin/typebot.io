import { ExternalLinkIcon } from '@/components/icons'
import { Alert, AlertIcon, Button, Link, Stack, Text } from '@chakra-ui/react'
import { MakeComBlock, Webhook, WebhookOptions } from '@typebot.io/schemas'
import { WebhookAdvancedConfigForm } from '../../webhook/components/WebhookAdvancedConfigForm'

type Props = {
  block: MakeComBlock
  onOptionsChange: (options: WebhookOptions) => void
}

export const MakeComSettings = ({
  block: { id: blockId, options },
  onOptionsChange,
}: Props) => {
  const setLocalWebhook = async (newLocalWebhook: Webhook) => {
    if (!options.webhook) return
    onOptionsChange({
      ...options,
      webhook: newLocalWebhook,
    })
  }

  const url = options.webhook?.url

  return (
    <Stack spacing={4}>
      <Alert status={url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {url ? (
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
      {options.webhook && (
        <WebhookAdvancedConfigForm
          blockId={blockId}
          webhook={options.webhook as Webhook}
          options={options}
          onWebhookChange={setLocalWebhook}
          onOptionsChange={onOptionsChange}
        />
      )}
    </Stack>
  )
}
