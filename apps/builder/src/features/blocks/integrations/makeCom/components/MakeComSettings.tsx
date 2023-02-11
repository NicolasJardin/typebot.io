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
import { MakeComBlock } from 'models'
import React from 'react'
import { byId } from 'utils'

type Props = {
  block: MakeComBlock
}

export const MakeComSettings = ({ block }: Props) => {
  const { webhooks } = useTypebot()
  const webhook = webhooks.find(byId(block.webhookId))

  return (
    <Stack spacing={4}>
      <Alert status={webhook?.url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {webhook?.url ? (
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
      {webhook?.url && <Input value={webhook?.url} isDisabled />}
    </Stack>
  )
}
