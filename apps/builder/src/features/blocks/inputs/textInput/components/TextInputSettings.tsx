import { TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { TimeMeasurementSelect } from '@/modules/time'
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react'
import { TextInputOptions, Variable } from '@typebot.io/schemas'
import { useState } from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'

type Props = {
  options: TextInputOptions
  onOptionsChange: (options: TextInputOptions) => void
}

export const TextInputSettings = ({ options, onOptionsChange }: Props) => {
  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })

  const [showMaximumWait, setShowMaximumWait] = useState<boolean>(false)

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

            <TimeMeasurementSelect />
          </FormControl>

          <TextInput
            // label={`${WaitForTypeEnumLabel[options.type]} para aguardar`}
            label="Horas para aguardar"
            // defaultValue={options.number?.toString()}
            // onChange={(value) => handleNumberChange(Number(value))}
            placeholder="0"
          />

          {/* {options.type === WaitForTypeEnum.DAY && (
                <TextInput
                  label="Horário para enviar mensagem:"
                  defaultValue={options.time}
                  onChange={handleTimeChange}
                  type="time"
                />
              )} */}

          <TextInput label="Horário para enviar mensagem:" type="time" />
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
