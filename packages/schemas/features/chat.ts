import { z } from 'zod'
import {
  googleAnalyticsOptionsSchema,
  InputBlockType,
  LogicBlockType,
  paymentInputRuntimeOptionsSchema,
  redirectOptionsSchema,
  removeTagOptionsSchema,
  spreadOptionsSchema,
  tagOptionsSchema,
  transferOptionsSchema,
  waitForOptionsSchema,
  WaitForTypeEnum,
  waitOptionsSchema,
} from './blocks'
import { publicTypebotSchema } from './publicTypebot'
import { logSchema, resultSchema } from './result'
import { typebotSchema } from './typebot'
import {
  textBubbleContentSchema,
  imageBubbleContentSchema,
  videoBubbleContentSchema,
  audioBubbleContentSchema,
  embedBubbleContentSchema,
  buttonOptionsSchema,
} from './blocks/bubbles'
import { fileBubbleContentSchema } from './blocks/bubbles/file'
import { answerSchema } from './answer'
import { BubbleBlockType } from './blocks/bubbles/enums'
import { inputBlockSchema } from './blocks'

const typebotInSessionStateSchema = publicTypebotSchema.pick({
  id: true,
  groups: true,
  edges: true,
  variables: true,
})

const dynamicThemeSchema = z.object({
  hostAvatarUrl: z.string().optional(),
  guestAvatarUrl: z.string().optional(),
})

const answerInSessionStateSchema = answerSchema.pick({
  content: true,
  blockId: true,
  variableId: true,
})

const resultInSessionStateSchema = resultSchema
  .pick({
    variables: true,
  })
  .merge(
    z.object({
      answers: z.array(answerInSessionStateSchema),
      id: z.string().optional(),
    })
  )

export const sessionStateSchema = z.object({
  typebot: typebotInSessionStateSchema,
  dynamicTheme: dynamicThemeSchema.optional(),
  linkedTypebots: z.object({
    typebots: z.array(typebotInSessionStateSchema),
    queue: z.array(z.object({ edgeId: z.string(), typebotId: z.string() })),
  }),
  currentTypebotId: z.string(),
  result: resultInSessionStateSchema,
  currentBlock: z
    .object({
      blockId: z.string(),
      groupId: z.string(),
    })
    .optional(),
})

const chatSessionSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  state: sessionStateSchema,
})

const textMessageSchema = z.object({
  type: z.literal(BubbleBlockType.TEXT),
  content: textBubbleContentSchema.omit({
    richText: true,
  }),
})

const imageMessageSchema = z.object({
  type: z.enum([BubbleBlockType.IMAGE]),
  content: imageBubbleContentSchema,
})

const videoMessageSchema = z.object({
  type: z.enum([BubbleBlockType.VIDEO]),
  content: videoBubbleContentSchema,
})

const audioMessageSchema = z.object({
  type: z.enum([BubbleBlockType.AUDIO]),
  content: audioBubbleContentSchema,
})

const fileMessageSchema = z.object({
  type: z.enum([BubbleBlockType.FILE]),
  content: fileBubbleContentSchema,
})

const transferMessageSchema = z.object({
  type: z.enum([LogicBlockType.TRANSFER]),
  content: transferOptionsSchema,
})

const spreadMessageSchema = z.object({
  type: z.enum([LogicBlockType.SPREAD]),
  content: spreadOptionsSchema,
})

const waitMessageSchema = z.object({
  type: z.enum([LogicBlockType.WAIT]),
  content: waitOptionsSchema,
})

const tagMessageSchema = z.object({
  type: z.enum([LogicBlockType.TAG]),
  content: tagOptionsSchema,
})

const waitForMessageSchema = z.object({
  type: z.enum([InputBlockType.WAIT_FOR]),
  content: waitForOptionsSchema,
})

const buttonMessageSchema = z.object({
  type: z.enum([BubbleBlockType.BUTTON]),
  content: buttonOptionsSchema,
})

const endMessageSchema = z.object({
  type: z.enum([LogicBlockType.END]),
  content: z.object({}),
})

const removeTagMessageSchema = z.object({
  type: z.enum([LogicBlockType.REMOVE_TAG]),
  content: removeTagOptionsSchema,
})

const embedMessageSchema = z.object({
  type: z.enum([BubbleBlockType.EMBED]),
  content: embedBubbleContentSchema
    .omit({
      height: true,
    })
    .merge(z.object({ height: z.number().optional() })),
})

const chatMessageSchema = z
  .object({ id: z.string() })
  .and(
    textMessageSchema
      .or(imageMessageSchema)
      .or(videoMessageSchema)
      .or(audioMessageSchema)
      .or(embedMessageSchema)
      .or(fileMessageSchema)
      .or(transferMessageSchema)
      .or(waitMessageSchema)
      .or(tagMessageSchema)
      .or(removeTagMessageSchema)
      .or(waitForMessageSchema)
      .or(buttonMessageSchema)
      .or(endMessageSchema)
      .or(spreadMessageSchema)
  )

const scriptToExecuteSchema = z.object({
  content: z.string(),
  args: z.array(
    z.object({
      id: z.string(),
      value: z
        .string()
        .or(z.number())
        .or(z.boolean())
        .or(z.array(z.string()))
        .nullish(),
    })
  ),
})

const startTypebotSchema = typebotSchema.pick({
  id: true,
  groups: true,
  edges: true,
  variables: true,
  settings: true,
  theme: true,
})

const startParamsSchema = z.object({
  typebot: startTypebotSchema
    .or(z.string())
    .describe(
      'Either a Typebot ID or a Typebot object. If you provide a Typebot object, it will be executed in preview mode. ([How can I find my typebot ID?](https://docs.typebot.io/api#how-to-find-my-typebotid)).'
    ),
  isPreview: z
    .boolean()
    .optional()
    .describe(
      "If set to `true`, it will start a Preview session with the unpublished bot and it won't be saved in the Results tab. You need to be authenticated for this to work."
    ),
  resultId: z
    .string()
    .optional()
    .describe("Provide it if you'd like to overwrite an existing result."),
  startGroupId: z
    .string()
    .optional()
    .describe('Start chat from a specific group.'),
  prefilledVariables: z
    .record(z.unknown())
    .optional()
    .describe(
      '[More info about prefilled variables.](https://docs.typebot.io/editor/variables#prefilled-variables)'
    ),
})

export const sendMessageInputSchema = z.object({
  message: z
    .string()
    .optional()
    .describe(
      'The answer to the previous chat input. Do not provide it if you are starting a new chat.'
    ),
  sessionId: z
    .string()
    .optional()
    .describe(
      'Session ID that you get from the initial chat request to a bot. If not provided, it will create a new session.'
    ),
  startParams: startParamsSchema.optional(),
})

const runtimeOptionsSchema = paymentInputRuntimeOptionsSchema.optional()

const replyLogSchema = logSchema
  .pick({
    status: true,
    description: true,
  })
  .merge(z.object({ details: z.unknown().optional() }))

const clientSideActionSchema = z
  .object({
    lastBubbleBlockId: z.string().optional(),
  })
  .and(
    z
      .object({
        scriptToExecute: scriptToExecuteSchema,
      })
      .or(
        z.object({
          redirect: redirectOptionsSchema,
        })
      )
      .or(
        z.object({
          chatwoot: z.object({ scriptToExecute: scriptToExecuteSchema }),
        })
      )
      .or(
        z.object({
          googleAnalytics: googleAnalyticsOptionsSchema,
        })
      )
      .or(
        z.object({
          wait: z.object({
            secondsToWaitFor: z.number(),
          }),
        })
      )
      .or(
        z.object({
          transfer: z.object({
            departmentId: z.string().optional(),
            attendantId: z.string().optional(),
            message: z.string(),
          }),
        })
      )
      .or(
        z.object({
          end: z.boolean(),
        })
      )
      .or(
        z.object({
          button: z.object({
            title: z.string(),
            url: z.string(),
          }),
        })
      )
      .or(
        z.object({
          createTag: z.object({
            name: z.string(),
          }),
        })
      )
      .or(
        z.object({
          removeTag: z.object({
            name: z.string(),
          }),
        })
      )
  )

export const chatReplySchema = z.object({
  messages: z.array(chatMessageSchema),
  input: inputBlockSchema
    .and(
      z.object({
        prefilledValue: z.string().optional(),
        runtimeOptions: runtimeOptionsSchema.optional(),
      })
    )
    .optional(),
  clientSideActions: z.array(clientSideActionSchema).optional(),
  sessionId: z.string().optional(),
  typebot: typebotSchema
    .pick({ id: true, theme: true, settings: true })
    .optional(),
  resultId: z.string().optional(),
  dynamicTheme: dynamicThemeSchema.optional(),
  logs: z.array(replyLogSchema).optional(),
})

export type ChatSession = z.infer<typeof chatSessionSchema>
export type SessionState = z.infer<typeof sessionStateSchema>
export type TypebotInSession = z.infer<typeof typebotInSessionStateSchema>
export type ResultInSession = z.infer<typeof resultInSessionStateSchema>
export type ChatReply = z.infer<typeof chatReplySchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>
export type ScriptToExecute = z.infer<typeof scriptToExecuteSchema>
export type StartParams = z.infer<typeof startParamsSchema>
export type RuntimeOptions = z.infer<typeof runtimeOptionsSchema>
export type StartTypebot = z.infer<typeof startTypebotSchema>
export type ReplyLog = z.infer<typeof replyLogSchema>
