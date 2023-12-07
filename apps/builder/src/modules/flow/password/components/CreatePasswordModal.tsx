import { TextInput } from '@/components/inputs'
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
import { TypebotUpdate } from '@typebot.io/schemas'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type CreatePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (typebot?: Partial<TypebotUpdate>) => void
  isLoading?: boolean
}

const schema = z
  .object({
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

type CreatePasswordModalForm = z.infer<typeof schema>

export function CreatePasswordModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreatePasswordModalProps) {
  const { control, handleSubmit } = useForm<CreatePasswordModalForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = useCallback(
    () =>
      handleSubmit((data) =>
        onSave({
          password: data.password,
        })
      )(),
    [handleSubmit, onSave]
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
          <ModalHeader>Adicionar uma senha para este fluxo?</ModalHeader>
          <ModalBody sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <Button isLoading={isLoading} onClick={() => onSave()}>
              Pular
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              sx={{ ml: 2 }}
              colorScheme="whatsapp"
            >
              Cadastrar com senha
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
