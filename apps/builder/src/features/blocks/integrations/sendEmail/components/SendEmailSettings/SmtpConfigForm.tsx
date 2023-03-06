import { TextInput, NumberInput } from '@/components/inputs'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { Stack } from '@chakra-ui/react'
import { isDefined } from '@udecode/plate-common'
import { SmtpCredentialsData } from 'models'
import React from 'react'

type Props = {
  config: SmtpCredentialsData
  onConfigChange: (config: SmtpCredentialsData) => void
}

export const SmtpConfigForm = ({ config, onConfigChange }: Props) => {
  const handleFromEmailChange = (email: string) =>
    onConfigChange({ ...config, from: { ...config.from, email } })
  const handleFromNameChange = (name: string) =>
    onConfigChange({ ...config, from: { ...config.from, name } })
  const handleHostChange = (host: string) => onConfigChange({ ...config, host })
  const handleUsernameChange = (username: string) =>
    onConfigChange({ ...config, username })
  const handlePasswordChange = (password: string) =>
    onConfigChange({ ...config, password })
  const handleTlsCheck = (isTlsEnabled: boolean) =>
    onConfigChange({ ...config, isTlsEnabled })
  const handlePortNumberChange = (port?: number) =>
    isDefined(port) && onConfigChange({ ...config, port })

  return (
    <Stack as="form" spacing={4}>
      <TextInput
        isRequired
        label="Do email"
        defaultValue={config.from.email ?? ''}
        onChange={handleFromEmailChange}
        placeholder="notificações@provedor.com"
        withVariableButton={false}
      />
      <TextInput
        label="Do nome"
        defaultValue={config.from.name ?? ''}
        onChange={handleFromNameChange}
        placeholder="John Smith"
        withVariableButton={false}
      />
      <TextInput
        isRequired
        label="Host"
        defaultValue={config.host ?? ''}
        onChange={handleHostChange}
        placeholder="email.provedor.com"
        withVariableButton={false}
      />
      <TextInput
        isRequired
        label="Nome de usuário / e-mail"
        type="email"
        defaultValue={config.username ?? ''}
        onChange={handleUsernameChange}
        placeholder="usuário@provedor.com"
        withVariableButton={false}
      />
      <TextInput
        isRequired
        label="Senha"
        type="password"
        defaultValue={config.password ?? ''}
        onChange={handlePasswordChange}
        withVariableButton={false}
      />
      <SwitchWithLabel
        label="Seguro?"
        initialValue={config.isTlsEnabled ?? false}
        onCheckChange={handleTlsCheck}
        moreInfoContent="Se ativado, a conexão usará TLS ao se conectar ao servidor. Se desativado, o TLS será usado se o servidor suportar a extensão STARTTLS. Na maioria dos casos, ative-o se estiver se conectando à porta 465. Para a porta 587 ou 25, mantenha-o desativado."
      />
      <NumberInput
        isRequired
        label="Número da porta:"
        placeholder="25"
        defaultValue={config.port}
        onValueChange={handlePortNumberChange}
        withVariableButton={false}
      />
    </Stack>
  )
}
