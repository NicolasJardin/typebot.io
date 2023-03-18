export * from '@prisma/client'

// Named export for enums to avoid vite barrel export bug (https://github.com/nrwl/nx/issues/13704)
export enum WorkspaceRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export enum Plan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  LIFETIME = 'LIFETIME',
  OFFERED = 'OFFERED',
  CUSTOM = 'CUSTOM',
  UNLIMITED = 'UNLIMITED',
}

export enum GraphNavigation {
  MOUSE = 'MOUSE',
  TRACKPAD = 'TRACKPAD',
}

export enum CollaborationType {
  READ = 'READ',
  WRITE = 'WRITE',
  FULL_ACCESS = 'FULL_ACCESS',
}
