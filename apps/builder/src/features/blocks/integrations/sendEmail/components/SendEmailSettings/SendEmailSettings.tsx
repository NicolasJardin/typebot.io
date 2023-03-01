import {
  Stack,
  useDisclosure,
  Text,
  Flex,
  HStack,
  Switch,
  FormLabel,
} from '@chakra-ui/react'
import { CodeEditor } from '@/components/CodeEditor'
import { CredentialsType, SendEmailOptions, Variable } from 'models'
import React, { useState } from 'react'
import { env, isNotEmpty } from 'utils'
import { SmtpConfigModal } from './SmtpConfigModal'
import { SwitchWithLabel } from '@/components/SwitchWithLabel'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { CredentialsDropdown } from '@/features/credentials'
import { Input, Textarea } from '@/components/inputs'

type Props = {
  options: SendEmailOptions
  onOptionsChange: (options: SendEmailOptions) => void
}

export const SendEmailSettings = ({ options, onOptionsChange }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [refreshCredentialsKey, setRefreshCredentialsKey] = useState(0)

  const handleCredentialsSelect = (credentialsId?: string) => {
    setRefreshCredentialsKey(refreshCredentialsKey + 1)
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
        <CredentialsDropdown
          type={CredentialsType.SMTP}
          currentCredentialsId={options.credentialsId}
          onCredentialsSelect={handleCredentialsSelect}
          onCreateNewClick={onOpen}
          defaultCredentialLabel={env('SMTP_FROM')
            ?.match(/<(.*)>/)
            ?.pop()}
          refreshDropdownKey={refreshCredentialsKey}
        />
      </Stack>
      <Stack>
        <Text>Responder a: </Text>
        <Input
          onChange={handleReplyToChange}
          defaultValue={options.replyTo}
          placeholder={'email@gmail.com'}
        />
      </Stack>
      <Stack>
        <Text>Para: </Text>
        <Input
          onChange={handleToChange}
          defaultValue={options.recipients.join(', ')}
          placeholder="email1@gmail.com, email2@gmail.com"
        />
      </Stack>
      <Stack>
        <Text>Cc: </Text>
        <Input
          onChange={handleCcChange}
          defaultValue={options.cc?.join(', ') ?? ''}
          placeholder="email1@gmail.com, email2@gmail.com"
        />
      </Stack>
      <Stack>
        <Text>Bcc: </Text>
        <Input
          onChange={handleBccChange}
          defaultValue={options.bcc?.join(', ') ?? ''}
          placeholder="email1@gmail.com, email2@gmail.com"
        />
      </Stack>
      <Stack>
        <Text>Assunto: </Text>
        <Input
          data-testid="subject-input"
          onChange={handleSubjectChange}
          defaultValue={options.subject ?? ''}
        />
      </Stack>
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
        <FormLabel mb="0" htmlFor="variable">
          Anexos:
        </FormLabel>
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
