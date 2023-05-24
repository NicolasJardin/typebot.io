export * from '@prisma/client'
export {
  WorkspaceRole,
  Plan,
  GraphNavigation,
  CollaborationType,
} from '@prisma/client'

// export const WorkspaceRole: { [x: string]: 'ADMIN' | 'MEMBER' | 'GUEST' } = {
//   ADMIN: 'ADMIN',
//   MEMBER: 'MEMBER',
//   GUEST: 'GUEST',
// }

// export type WorkspaceRole = typeof WorkspaceRole[keyof typeof WorkspaceRole]

// export const Plan: {
//   [x: string]:
//     | 'FREE'
//     | 'STARTER'
//     | 'PRO'
//     | 'LIFETIME'
//     | 'OFFERED'
//     | 'CUSTOM'
//     | 'UNLIMITED'
// } = {
//   FREE: 'FREE',
//   STARTER: 'STARTER',
//   PRO: 'PRO',
//   LIFETIME: 'LIFETIME',
//   OFFERED: 'OFFERED',
//   CUSTOM: 'CUSTOM',
//   UNLIMITED: 'UNLIMITED',
// }

// export type Plan = typeof Plan[keyof typeof Plan]

// export const GraphNavigation: { [x: string]: 'MOUSE' | 'TRACKPAD' } = {
//   MOUSE: 'MOUSE',
//   TRACKPAD: 'TRACKPAD',
// }

// export type GraphNavigation =
//   typeof GraphNavigation[keyof typeof GraphNavigation]

// export const CollaborationType: {
//   [x: string]: 'READ' | 'WRITE' | 'FULL_ACCESS'
// } = {
//   READ: 'READ',
//   WRITE: 'WRITE',
//   FULL_ACCESS: 'FULL_ACCESS',
// }

// export type CollaborationType =
//   typeof CollaborationType[keyof typeof CollaborationType]
