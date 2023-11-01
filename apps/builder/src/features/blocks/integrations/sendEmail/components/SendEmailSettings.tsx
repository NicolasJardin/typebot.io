import { Textarea, TextInput } from '@/components/inputs'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { MoreInfoTooltip } from '@/components/MoreInfoTooltip'
import { CredentialsDropdown } from '@/features/credentials/components/CredentialsDropdown'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import {
  Flex,
  FormLabel,
  HStack,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { isNotEmpty } from '@typebot.io/lib'
import { SendEmailOptions, Variable } from '@typebot.io/schemas'
import { SmtpConfigModal } from './SmtpConfigModal'
import { env } from '@typebot.io/env'

type Props = {
  options: SendEmailOptions
  onOptionsChange: (options: SendEmailOptions) => void
}

export const SendEmailSettings = ({ options, onOptionsChange }: Props) => {
  const { workspace } = useWorkspace()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleCredentialsSelect = (credentialsId?: string) => {
    onOptionsChange({
      ...options,
      credentialsId: credentialsId === undefined ? 'default' : credentialsId,
    })
  }

  const handleToChange = (recipientsStr: string) => {
    const recipients: string[] = recipientsStr
      .split(',')
      .map((str) => str.trim())
      .filter(isNotEmpty)
    onOptionsChange({
      ...options,
      recipients,
    })
  }

  const handleCcChange = (ccStr: string) => {
    const cc: string[] = ccStr
      .split(',')
      .map((str) => str.trim())
      .filter(isNotEmpty)
    onOptionsChange({
      ...options,
      cc,
    })
  }

  const handleBccChange = (bccStr: string) => {
    const bcc: string[] = bccStr
      .split(',')
      .map((str) => str.trim())
      .filter(isNotEmpty)
    onOptionsChange({
      ...options,
      bcc,
    })
  }

  const handleSubjectChange = (subject: string) =>
    onOptionsChange({
      ...options,
      subject,
    })

  const handleBodyChange = (body: string) =>
    onOptionsChange({
      ...options,
      body,
    })

  const handleReplyToChange = (replyTo: string) =>
    onOptionsChange({
      ...options,
      replyTo,
    })

  const handleIsCustomBodyChange = (isCustomBody: boolean) =>
    onOptionsChange({
      ...options,
      isCustomBody,
    })

  const handleIsBodyCodeChange = () =>
    onOptionsChange({
      ...options,
      isBodyCode: options.isBodyCode ? !options.isBodyCode : true,
    })

  const handleChangeAttachmentVariable = (
    variable: Pick<Variable, 'id' | 'name'> | undefined
  ) =>
    onOptionsChange({
      ...options,
      attachmentsVariableId: variable?.id,
    })

  return (
    <Stack spacing={4}>
      <Stack>
        <Text>De: </Text>
        {workspace && (
          <CredentialsDropdown
            type="smtp"
            workspaceId={workspace.id}
            currentCredentialsId={options.credentialsId}
            onCredentialsSelect={handleCredentialsSelect}
            onCreateNewClick={onOpen}
            defaultCredentialLabel={env.NEXT_PUBLIC_SMTP_FROM?.match(
              /<(.*)>/
            )?.pop()}
            credentialsName="SMTP account"
          />
        )}
      </Stack>
      <TextInput
        label="Responder a:"
        onChange={handleReplyToChange}
        defaultValue={options.replyTo}
        placeholder={'email@gmail.com'}
      />
      <TextInput
        label="Para:"
        onChange={handleToChange}
        defaultValue={options.recipients.join(', ')}
        placeholder="email1@gmail.com, email2@gmail.com"
      />
      <TextInput
        label="Cc:"
        onChange={handleCcChange}
        defaultValue={options.cc?.join(', ') ?? ''}
        placeholder="email1@gmail.com, email2@gmail.com"
      />
      <TextInput
        label="Bcc:"
        onChange={handleBccChange}
        defaultValue={options.bcc?.join(', ') ?? ''}
        placeholder="email1@gmail.com, email2@gmail.com"
      />
      <TextInput
        label="Assunto:"
        onChange={handleSubjectChange}
        defaultValue={options.subject ?? ''}
      />
      <SwitchWithLabel
        label={'Conteúdo personalizado?'}
        moreInfoContent="Por padrão, o corpo do email será uma recapitulação do que foi coletado até agora. Você pode substituí-lo com esta opção."
        initialValue={options.isCustomBody ?? false}
        onCheckChange={handleIsCustomBodyChange}
      />
      {options.isCustomBody && (
        <Stack>
          <Flex justifyContent="space-between">
            <Text>Conteúdo: </Text>
            <HStack>
              <Text fontSize="sm">Texto</Text>
              <Switch
                size="sm"
                isChecked={options.isBodyCode ?? false}
                onChange={handleIsBodyCodeChange}
              />
              <Text fontSize="sm">Código</Text>
            </HStack>
          </Flex>
          {options.isBodyCode ? (
            <CodeEditor
              defaultValue={options.body ?? ''}
              onChange={handleBodyChange}
              lang="html"
            />
          ) : (
            <Textarea
              data-testid="body-input"
              minH="300px"
              onChange={handleBodyChange}
              defaultValue={options.body ?? ''}
            />
          )}
        </Stack>
      )}
      <Stack>
        <HStack>
          <FormLabel m="0" htmlFor="variable">
            Arquivos para anexar:
          </FormLabel>
          <MoreInfoTooltip>
            A variável selecionada deve ter previamente coletado arquivos do
            bloco de entrada de upload de arquivo.
          </MoreInfoTooltip>
        </HStack>

        <VariableSearchInput
          initialVariableId={options.attachmentsVariableId}
          onSelectVariable={handleChangeAttachmentVariable}
        />
      </Stack>
      <SmtpConfigModal
        isOpen={isOpen}
        onClose={onClose}
        onNewCredentials={handleCredentialsSelect}
      />
    </Stack>
  )
}
