import {
  Alert,
  AlertIcon,
  Button,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor'
import { ZapierBlock } from 'models'
import React from 'react'
import { byId } from 'utils'

type Props = {
  block: ZapierBlock
}

export const ZapierSettings = ({ block }: Props) => {
  const { webhooks } = useTypebot()
  const webhook = webhooks.find(byId(block.webhookId))

  return (
    <Stack spacing={4}>
      <Alert status={webhook?.url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {webhook?.url ? (
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
      {webhook?.url && <Input value={webhook?.url} isDisabled />}
    </Stack>
  )
}
