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
import { trpc, trpcVanilla } from '@/lib/trpc'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { duplicateName } from '@/features/typebot/helpers/duplicateName'

type DuplicatePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  typebot: TypebotInDashboard
}

const schema = z.object({
  password: z
    .string()
    .min(1, { message: 'Campo de preenchimento obrigatório.' }),
})

type DuplicatePasswordModalForm = z.infer<typeof schema>

export function DuplicatePasswordModal({
  isOpen,
  onClose,
  typebot,
}: DuplicatePasswordModalProps) {
  const { mutateAsync: createTypebot } = trpc.typebot.createTypebot.useMutation(
    {
      onError: (error) => {
        showToast({ description: error.message })
      },
    }
  )

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: unlockTypebot } =
    trpc.typebot.unlockTypebot.useMutation()

  const { control, handleSubmit, setError } =
    useForm<DuplicatePasswordModalForm>({
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
          await unlockTypebot(
            {
              typebotId: typebot.id,
              password: data.password,
            },
            {}
          )

          const { typebot: typebotToDuplicate } =
            await trpcVanilla.typebot.getTypebot.query({
              typebotId: typebot.id,
            })

          if (!typebotToDuplicate) return

          await createTypebot(
            {
              workspaceId: typebotToDuplicate.workspaceId,
              typebot: {
                ...typebotToDuplicate,
                customDomain: undefined,
                publicId: undefined,
                name: duplicateName(typebotToDuplicate.name),
                password: data.password,
              },
            },
            {
              onSuccess: async ({ typebot }) => {
                const { token } = await unlockTypebot({
                  typebotId: typebot.id,
                  password: data.password,
                })

                setCookie(`unlock-${typebot.id}`, token)

                router.push(`/typebots/${typebot.id}/edit`)
              },
            }
          )
        } catch (e) {
          setIsLoading(false)

          if (
            (e as { shape?: { message?: string } })?.shape?.message ===
            'Senha esta incorreta'
          )
            setError('password', { message: 'Senha invalida!' })
        }
      })(),
    [handleSubmit, unlockTypebot, typebot.id, router, setError, createTypebot]
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
          <ModalHeader>Duplicar Fluxo {typebot.name}</ModalHeader>
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
                  label="Digite a senha para duplicar o fluxo"
                  placeholder="Digite a senha"
                  withVariableButton={false}
                  debounceTimeout={0}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" isLoading={isLoading}>
              Duplicar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
