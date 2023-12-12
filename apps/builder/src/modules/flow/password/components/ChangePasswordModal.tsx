import { TextInput } from '@/components/inputs'
import { TypebotInDashboard } from '@/features/dashboard/types'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/lib/trpc'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type ChangePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  typebot: TypebotInDashboard
}

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Campo de preenchimento obrigatório.' }),
    password: z
      .string()
      .min(1, { message: 'Campo de preenchimento obrigatório.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Campo de preenchimento obrigatório.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ChangePasswordModalForm = z.infer<typeof schema>

export function ChangePasswordModal({
  isOpen,
  onClose,
  typebot,
}: ChangePasswordModalProps) {
  const { control, handleSubmit } = useForm<ChangePasswordModalForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      currentPassword: '',
    },
  })

  const { showToast } = useToast()

  const { mutate: changePassword, isLoading } =
    trpc.typebot.changePassword.useMutation({
      onError: (error) => {
        showToast({ description: error.message })
      },
      onSuccess: () => {
        showToast({
          description: 'Senha atualizada com sucesso!',
          status: 'success',
        })
        onClose()
      },
    })

  const onSubmit = useCallback(
    () =>
      handleSubmit(async (data) =>
        changePassword({
          typebotId: typebot.id,
          currentPassword: data.currentPassword,
          password: data.password,
        })
      )(),
    [handleSubmit, changePassword, typebot.id]
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
          <ModalHeader>Editar senha</ModalHeader>
          <ModalBody sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              control={control}
              name="currentPassword"
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
                  label="Senha atual"
                  placeholder="Digite a senha atual"
                  withVariableButton={false}
                  debounceTimeout={0}
                />
              )}
            />

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
                  label="Senha"
                  placeholder="Digite a senha"
                  withVariableButton={false}
                  debounceTimeout={0}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
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
                  label="Confirmação de senha"
                  placeholder="Confime a senha"
                  withVariableButton={false}
                  debounceTimeout={0}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isLoading}
              sx={{ ml: 2 }}
              colorScheme="whatsapp"
            >
              Alterar senha
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
