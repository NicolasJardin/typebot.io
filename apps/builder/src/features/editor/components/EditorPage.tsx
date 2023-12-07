import { Seo } from '@/components/Seo'
import { Graph } from '@/features/graph/components/Graph'
import { GraphDndProvider } from '@/features/graph/providers/GraphDndProvider'
import { GraphProvider } from '@/features/graph/providers/GraphProvider'
import { GroupsCoordinatesProvider } from '@/features/graph/providers/GroupsCoordinateProvider'
import { PreviewDrawer } from '@/features/preview/components/PreviewDrawer'
import { trpc } from '@/lib/trpc'
import { Flex, Spinner, useColorModeValue } from '@chakra-ui/react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import {
  EditorProvider,
  RightPanel as RightPanelEnum,
  useEditor,
} from '../providers/EditorProvider'
import { useTypebot } from '../providers/TypebotProvider'
import { BlocksSideBar } from './BlocksSideBar'
import { BoardMenuButton } from './BoardMenuButton'
import { GettingStartedModal } from './GettingStartedModal'
import { TypebotHeader } from './TypebotHeader'

export const EditorPage = () => {
  const { typebot, isReadOnly } = useTypebot()

  const router = useRouter()

  const currentTypebotToken = useMemo(
    () => getCookie(`unlock-${typebot?.id}`) as string,
    [typebot?.id]
  )

  const { data } = trpc.typebot.verifyIfTypebotIsUnlocked.useQuery(
    {
      typebotId: typebot?.id || '',
      token: currentTypebotToken,
    },
    {
      suspense: true,
      enabled: Boolean(typebot?.id) && Boolean(currentTypebotToken),
    }
  )

  const bgColor = useColorModeValue('#f4f5f8', 'gray.850')

  const backgroundImage = useColorModeValue(
    'radial-gradient(#c6d0e1 1px, transparent 0)',
    'radial-gradient(#2f2f39 1px, transparent 0)'
  )

  const handlePassword = useCallback(() => {
    if (typebot && typebot.hasPassword) {
      if (!currentTypebotToken || !data?.unlocked) {
        return router.push('/typebots')
      }
    }
  }, [router, typebot, data?.unlocked, currentTypebotToken])

  useEffect(() => {
    handlePassword()
  }, [handlePassword])

  if (
    typebot &&
    typebot.hasPassword &&
    (!currentTypebotToken || !data?.unlocked)
  )
    return null

  return (
    <EditorProvider>
      <Seo title={typebot?.name ? `${typebot.name} | Editor` : 'Editor'} />
      <Flex overflow="clip" h="100vh" flexDir="column" id="editor-container">
        <GettingStartedModal />
        <TypebotHeader />
        <Flex
          flex="1"
          pos="relative"
          h="full"
          bgColor={bgColor}
          backgroundImage={backgroundImage}
          backgroundSize="40px 40px"
          backgroundPosition="-19px -19px"
        >
          {typebot ? (
            <GraphDndProvider>
              {!isReadOnly && <BlocksSideBar />}
              <GraphProvider isReadOnly={isReadOnly}>
                <GroupsCoordinatesProvider groups={typebot.groups}>
                  <Graph flex="1" typebot={typebot} key={typebot.id} />
                  <BoardMenuButton pos="absolute" right="40px" top="20px" />
                  <RightPanel />
                </GroupsCoordinatesProvider>
              </GraphProvider>
            </GraphDndProvider>
          ) : (
            <Flex justify="center" align="center" boxSize="full">
              <Spinner color="gray" />
            </Flex>
          )}
        </Flex>
      </Flex>
    </EditorProvider>
  )
}

const RightPanel = () => {
  const { rightPanel } = useEditor()
  return rightPanel === RightPanelEnum.PREVIEW ? <PreviewDrawer /> : <></>
}
