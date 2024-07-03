import { TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { TimeMeasurementSelect, useTime } from '@/modules/time'
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  TextInputOptions,
  Variable,
  WaitForTypeEnum,
  WaitForTypeEnumLabel,
} from '@typebot.io/schemas'
import { isValid } from 'date-fns'
import { ChangeEvent, useCallback, useState } from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'

type Props = {
  options: TextInputOptions
  onOptionsChange: (options: TextInputOptions) => void
}

export const TextInputSettings = ({ options, onOptionsChange }: Props) => {
  const { getUntil } = useTime()

  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })

  const handleNumberChange = useCallback(
    (number: number | undefined) =>
      onOptionsChange({
        ...options,
        wait: {
          ...options.wait,
          number,
          type: options.wait?.type || WaitForTypeEnum.HOUR,
          until: options.wait
            ? getUntil({ ...options.wait, number })
            : undefined,
        },
      }),
    [onOptionsChange, options, getUntil]
  )

  const handleTimeChange = useCallback(
    (time: string | undefined) =>
      onOptionsChange({
        ...options,
        wait: {
          ...options.wait,
          time,
          type: options.wait?.type || WaitForTypeEnum.HOUR,
          until: options.wait ? getUntil({ ...options.wait, time }) : undefined,
        },
      }),
    [onOptionsChange, options, getUntil]
  )

  const handleTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        wait: {
          ...options.wait,
          type: e.target.value as WaitForTypeEnum,
          until: options.wait
            ? getUntil({
                ...options.wait,
                type: e.target.value as WaitForTypeEnum,
              })
            : undefined,
        },
      }),
    [onOptionsChange, options, getUntil]
  )

  const [showMaximumWait, setShowMaximumWait] = useState<boolean>(
    options.wait?.until ? isValid(new Date(options.wait.until)) : false
  )

  return (
    <Stack spacing={4}>
      <Stack>
        <FormLabel mb="0" htmlFor="variable">
          Salvar resposta em uma variável:
        </FormLabel>
        <VariableSearchInput
          initialVariableId={options.variableId}
          onSelectVariable={handleVariableChange}
        />
      </Stack>
      {showMaximumWait ? (
        <Stack spacing={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Divider backgroundColor="#fff" />

            <Text fontWeight={700}>Ou</Text>

            <Divider backgroundColor="#fff" />
          </Stack>

          <FormControl>
            <FormLabel>Medida de tempo</FormLabel>

            <TimeMeasurementSelect
              value={options.wait?.type}
              onChange={handleTypeChange}
            />
          </FormControl>

          <TextInput
            label={`${
              options.wait?.type
                ? WaitForTypeEnumLabel[options.wait.type]
                : WaitForTypeEnumLabel[WaitForTypeEnum.HOUR]
            } para aguardar`}
            defaultValue={options.wait?.number?.toString()}
            onChange={(value) => handleNumberChange(Number(value))}
            placeholder="0"
            helperText={
              typeof options?.wait?.number === 'number' &&
              options?.wait?.number < 1 ? (
                <Text color={'red.500'}>Digite um valor maior que 0</Text>
              ) : null
            }
          />

          {options.wait?.type === WaitForTypeEnum.DAY && (
            <TextInput
              label="Horário para enviar mensagem:"
              defaultValue={options.wait?.time}
              onChange={handleTimeChange}
              type="time"
            />
          )}
        </Stack>
      ) : (
        <Button
          leftIcon={<AiOutlineClockCircle size={25} />}
          onClick={() => setShowMaximumWait(true)}
          variant="link"
          alignSelf="flex-start"
        >
          <Text fontSize={14} color="#337AB0">
            ADICIONAR ESPERA MÁXIMA
          </Text>
        </Button>
      )}
    </Stack>
  )
}
