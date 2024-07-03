import { areTypebotsEqual } from '@/features/publish/helpers/areTypebotsEqual'
import { convertPublicTypebotToTypebot } from '@/features/publish/helpers/convertPublicTypebotToTypebot'
import { isPublished as isPublishedHelper } from '@/features/publish/helpers/isPublished'
import { preventUserFromRefreshing } from '@/helpers/preventUserFromRefreshing'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/lib/trpc'
import { isDefined, omit } from '@typebot.io/lib'
import { LogicBlockType, PublicTypebot, Typebot } from '@typebot.io/schemas'
import { dequal } from 'dequal'
import { Router, useRouter } from 'next/router'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useUndo } from '../hooks/useUndo'
import { BlocksActions, blocksAction } from './typebotActions/blocks'
import { EdgesActions, edgesAction } from './typebotActions/edges'
import { GroupsActions, groupsActions } from './typebotActions/groups'
import { ItemsActions, itemsAction } from './typebotActions/items'
import { VariablesActions, variablesAction } from './typebotActions/variables'

const autoSaveTimeout = 10000

type UpdateTypebotPayload = Partial<
  Pick<
    Typebot,
    | 'theme'
    | 'selectedThemeTemplateId'
    | 'settings'
    | 'publicId'
    | 'name'
    | 'icon'
    | 'customDomain'
    | 'resultsTablePreferences'
    | 'isClosed'
  >
>

export type SetTypebot = (
  newPresent: Typebot | ((current: Typebot) => Typebot)
) => void

const typebotContext = createContext<
  {
    typebot?: Typebot
    publishedTypebot?: PublicTypebot
    linkedTypebots?: Pick<Typebot, 'id' | 'groups' | 'variables' | 'name'>[]
    isReadOnly?: boolean
    isPublished: boolean
    isSavingLoading: boolean
    save: () => Promise<Typebot | undefined>
    undo: () => void
    redo: () => void
    canRedo: boolean
    canUndo: boolean
    updateTypebot: (props: {
      updates: UpdateTypebotPayload
      save?: boolean
    }) => Promise<Typebot | undefined>
    restorePublishedTypebot: () => void
  } & GroupsActions &
    BlocksActions &
    ItemsActions &
    VariablesActions &
    EdgesActions
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
>({})

export const TypebotProvider = ({
  children,
  typebotId,
}: {
  children: ReactNode
  typebotId?: string
}) => {
  const { push } = useRouter()
  const { showToast } = useToast()

  const {
    data: typebotData,
    isLoading: isFetchingTypebot,
    refetch: refetchTypebot,
  } = trpc.typebot.getTypebot.useQuery(
    { typebotId: typebotId as string },
    {
      enabled: isDefined(typebotId),
      onError: (error) =>
        showToast({
          title: 'Error while fetching typebot. Refresh the page.',
          description: error.message,
        }),
    }
  )

  const { data: publishedTypebotData } =
    trpc.typebot.getPublishedTypebot.useQuery(
      { typebotId: typebotId as string },
      {
        enabled: isDefined(typebotId),
        onError: (error) =>
          showToast({
            title: 'Error while fetching published typebot',
            description: error.message,
          }),
      }
    )

  const { mutateAsync: updateTypebot, isLoading: isSaving } =
    trpc.typebot.updateTypebot.useMutation({
      onError: (error) =>
        showToast({
          title: 'Erro ao atualizar o typebot',
          description: error.message,
        }),
      onSuccess: () => {
        if (!typebotId) return
        refetchTypebot()
      },
    })

  const typebot = typebotData?.typebot
  const publishedTypebot = publishedTypebotData?.publishedTypebot ?? undefined

  const [
    localTypebot,
    { redo, undo, flush, canRedo, canUndo, set: setLocalTypebot },
  ] = useUndo<Typebot>(undefined)

  const linkedTypebotIds = useMemo(
    () =>
      typebot?.groups
        .flatMap((group) => group.blocks)
        .reduce<string[]>(
          (typebotIds, block) =>
            block.type === LogicBlockType.TYPEBOT_LINK &&
            isDefined(block.options.typebotId) &&
            !typebotIds.includes(block.options.typebotId)
              ? [...typebotIds, block.options.typebotId]
              : typebotIds,
          []
        ) ?? [],
    [typebot?.groups]
  )

  const { data: linkedTypebotsData } = trpc.getLinkedTypebots.useQuery(
    {
      typebotId: typebot?.id as string,
    },
    {
      enabled: isDefined(typebot?.id) && linkedTypebotIds.length > 0,
      onError: (error) =>
        showToast({
          title: 'Erro ao buscar typebots conectados',
          description: error.message,
        }),
    }
  )

  useEffect(() => {
    if (!typebot && isDefined(localTypebot)) setLocalTypebot(undefined)
    if (isFetchingTypebot) return
    if (!typebot) {
      showToast({
        status: 'info',
        description: 'Não foi possível encontrar o fluxo',
      })
      push('/typebots')
      return
    }
    if (
      typebot.id !== localTypebot?.id ||
      new Date(typebot.updatedAt).getTime() >
        new Date(localTypebot.updatedAt).getTime()
    ) {
      setLocalTypebot({ ...typebot })
      flush()
    }
  }, [
    flush,
    isFetchingTypebot,
    localTypebot,
    push,
    setLocalTypebot,
    showToast,
    typebot,
  ])

  const saveTypebot = useCallback(
    async (updates?: Partial<Typebot>) => {
      if (!localTypebot || !typebot) return
      const typebotToSave = { ...localTypebot, ...updates }
      if (dequal(omit(typebot, 'updatedAt'), omit(typebotToSave, 'updatedAt')))
        return
      setLocalTypebot({ ...typebotToSave })
      const { typebot: newTypebot } = await updateTypebot({
        typebotId: typebotToSave.id,
        typebot: typebotToSave,
      })
      setLocalTypebot({ ...newTypebot })
      return newTypebot
    },
    [localTypebot, setLocalTypebot, typebot, updateTypebot]
  )

  useAutoSave(
    {
      handler: saveTypebot,
      item: localTypebot,
      debounceTimeout: autoSaveTimeout,
    },
    [saveTypebot, localTypebot]
  )

  useEffect(() => {
    const handleSaveTypebot = () => {
      saveTypebot()
    }
    Router.events.on('routeChangeStart', handleSaveTypebot)
    return () => {
      Router.events.off('routeChangeStart', handleSaveTypebot)
    }
  }, [saveTypebot])

  const isPublished = useMemo(
    () =>
      isDefined(localTypebot) &&
      isDefined(localTypebot.publicId) &&
      isDefined(publishedTypebot) &&
      isPublishedHelper(localTypebot, publishedTypebot),
    [localTypebot, publishedTypebot]
  )

  useEffect(() => {
    if (!localTypebot || !typebot) return
    if (!areTypebotsEqual(localTypebot, typebot)) {
      window.addEventListener('beforeunload', preventUserFromRefreshing)
    }

    return () => {
      window.removeEventListener('beforeunload', preventUserFromRefreshing)
    }
  }, [localTypebot, typebot])

  const updateLocalTypebot = async ({
    updates,
    save,
  }: {
    updates: UpdateTypebotPayload
    save?: boolean
  }) => {
    if (!localTypebot) return
    const newTypebot = { ...localTypebot, ...updates }
    setLocalTypebot(newTypebot)
    if (save) await saveTypebot(newTypebot)
    return newTypebot
  }

  const restorePublishedTypebot = () => {
    if (!publishedTypebot || !localTypebot) return
    setLocalTypebot(
      convertPublicTypebotToTypebot(publishedTypebot, localTypebot)
    )
  }

  return (
    <typebotContext.Provider
      value={{
        typebot: localTypebot,
        publishedTypebot,
        linkedTypebots: linkedTypebotsData?.typebots ?? [],
        isReadOnly: typebotData?.isReadOnly,
        isSavingLoading: isSaving,
        save: saveTypebot,
        undo,
        redo,
        canUndo,
        canRedo,
        isPublished,
        updateTypebot: updateLocalTypebot,
        restorePublishedTypebot,
        ...groupsActions(setLocalTypebot as SetTypebot),
        ...blocksAction(setLocalTypebot as SetTypebot),
        ...variablesAction(setLocalTypebot as SetTypebot),
        ...edgesAction(setLocalTypebot as SetTypebot),
        ...itemsAction(setLocalTypebot as SetTypebot),
      }}
    >
      {children}
    </typebotContext.Provider>
  )
}

export const useTypebot = () => useContext(typebotContext)
