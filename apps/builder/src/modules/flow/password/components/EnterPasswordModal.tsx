import { TextInput } from '@/components/inputs'
import { TypebotInDashboard } from '@/features/dashboard/types'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCallback, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'

type EnterPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  typebot: TypebotInDashboard
}

const schema = z.object({
  password: z
    .string()
    .min(1, { message: 'Campo de preenchimento obrigatório.' }),
})

type EnterPasswordModalForm = z.infer<typeof schema>

export function EnterPasswordModal({
  isOpen,
  onClose,
  typebot,
}: EnterPasswordModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: unlockTypebot } =
    trpc.typebot.unlockTypebot.useMutation()

  const { control, handleSubmit, setError } = useForm<EnterPasswordModalForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = useCallback(
    () =>
      handleSubmit(async (data) => {
        try {
          setIsLoading(true)
          const { token } = await unlockTypebot({
            typebotId: typebot.id,
            password: data.password,
          })

          setCookie(`unlock-${typebot.id}`, token)

          router.push(`/typebots/${typebot.id}/edit`)
        } catch (e) {
          setIsLoading(false)

          if (
            (e as { shape?: { message?: string } })?.shape?.message ===
            'Password is invalid'
          )
            setError('password', { message: 'Senha invalida!' })
        }
      })(),
    [handleSubmit, unlockTypebot, typebot.id, router, setError]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form
          noValidate
          onSubmit={(event) => {
            onSubmit()
            event.preventDefault()
          }}
        >
          <ModalHeader>Fluxo {typebot.name}</ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="password"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextInput
                  onChange={onChange}
                  defaultValue={value}
                  isRequired
                  helperText={<Text color="red.400">{error?.message}</Text>}
                  type="password"
                  label="Digite a senha para entrar no fluxo"
                  placeholder="Digite a senha"
                  withVariableButton={false}
                  debounceTimeout={0}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" isLoading={isLoading}>
              Entrar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
