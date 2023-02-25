import {
  Stack,
  Text,
  SimpleGrid,
  useEventListener,
  Portal,
  Flex,
  IconButton,
  Tooltip,
  Fade,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  BubbleBlockType,
  DraggableBlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
} from 'models'
import { useBlockDnd } from '@/features/graph'
import React, { useState } from 'react'
import { BlockCard } from './BlockCard'
import { LockedIcon, UnlockedIcon } from '@/components/icons'
import { headerHeight } from '../../constants'
import { BlockCardOverlay } from './BlockCardOverlay'

export const BlocksSideBar = () => {
  const { setDraggedBlockType, draggedBlockType } = useBlockDnd()
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })
  const [relativeCoordinates, setRelativeCoordinates] = useState({ x: 0, y: 0 })
  const [isLocked, setIsLocked] = useState(true)
  const [isExtended, setIsExtended] = useState(true)

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggedBlockType) return
    const { clientX, clientY } = event
    setPosition({
      ...position,
      x: clientX - relativeCoordinates.x,
      y: clientY - relativeCoordinates.y,
    })
  }
  useEventListener('mousemove', handleMouseMove)

  const handleMouseDown = (e: React.MouseEvent, type: DraggableBlockType) => {
    const element = e.currentTarget as HTMLDivElement
    const rect = element.getBoundingClientRect()
    setPosition({ x: rect.left, y: rect.top })
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRelativeCoordinates({ x, y })
    setDraggedBlockType(type)
  }

  const handleMouseUp = () => {
    if (!draggedBlockType) return
    setDraggedBlockType(undefined)
    setPosition({
      x: 0,
      y: 0,
    })
  }
  useEventListener('mouseup', handleMouseUp)

  const handleLockClick = () => setIsLocked(!isLocked)

  const handleDockBarEnter = () => setIsExtended(true)

  const handleMouseLeave = () => {
    if (isLocked) return
    setIsExtended(false)
  }

  return (
    <Flex
      w="370px"
      pos="absolute"
      left="0"
      h={`calc(100vh - ${headerHeight}px)`}
      zIndex="2"
      pl="4"
      py="4"
      onMouseLeave={handleMouseLeave}
      transform={isExtended ? 'translateX(0)' : 'translateX(-350px)'}
      transition="transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1) 0s"
    >
      <Stack
        w="full"
        rounded="lg"
        shadow="xl"
        borderWidth="1px"
        pt="2"
        pb="10"
        px="4"
        bgColor={useColorModeValue('white', 'gray.900')}
        spacing={6}
        userSelect="none"
        overflowY="scroll"
        className="hide-scrollbar"
      >
        <Flex justifyContent="flex-end">
          <Tooltip
            label={
              isLocked ? 'Desbloquear barra lateral' : 'Bloquear barra lateral'
            }
          >
            <IconButton
              icon={isLocked ? <LockedIcon /> : <UnlockedIcon />}
              aria-label={isLocked ? 'Desbloquear' : 'Bloquear'}
              size="sm"
              onClick={handleLockClick}
            />
          </Tooltip>
        </Flex>

        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            Enviar
          </Text>
          <SimpleGrid columns={2} spacing="3">
            <BlockCard
              type={BubbleBlockType.TEXT}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={BubbleBlockType.IMAGE}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={BubbleBlockType.VIDEO}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={BubbleBlockType.AUDIO}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={BubbleBlockType.BUTTON}
              onMouseDown={handleMouseDown}
            />
          </SimpleGrid>
        </Stack>

        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            Receber
          </Text>
          <SimpleGrid columns={2} spacing="3">
            <BlockCard
              type={InputBlockType.TEXT}
              onMouseDown={handleMouseDown}
            />
          </SimpleGrid>
        </Stack>

        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            Lógica
          </Text>
          <SimpleGrid columns={2} spacing="3">
            <BlockCard
              type={LogicBlockType.SET_VARIABLE}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.CONDITION}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.SCRIPT}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.TYPEBOT_LINK}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.TAG}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.WAIT}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.WAIT_FOR}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.TRANSFER}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={LogicBlockType.END}
              onMouseDown={handleMouseDown}
            />
          </SimpleGrid>
        </Stack>

        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            Integrações
          </Text>
          <SimpleGrid columns={2} spacing="3">
            <BlockCard
              type={IntegrationBlockType.GOOGLE_SHEETS}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={IntegrationBlockType.GOOGLE_ANALYTICS}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={IntegrationBlockType.WEBHOOK}
              onMouseDown={handleMouseDown}
            />

            <BlockCard
              type={IntegrationBlockType.EMAIL}
              onMouseDown={handleMouseDown}
            />
          </SimpleGrid>
        </Stack>

        {draggedBlockType && (
          <Portal>
            <BlockCardOverlay
              type={draggedBlockType}
              onMouseUp={handleMouseUp}
              pos="fixed"
              top="0"
              left="0"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(-2deg)`,
              }}
            />
          </Portal>
        )}
      </Stack>
      <Fade in={!isLocked} unmountOnExit>
        <Flex
          pos="absolute"
          h="100%"
          right="-50px"
          w="50px"
          top="0"
          justify="center"
          align="center"
          onMouseEnter={handleDockBarEnter}
        >
          <Flex w="5px" h="20px" bgColor="gray.400" rounded="md" />
        </Flex>
      </Fade>
    </Flex>
  )
}
