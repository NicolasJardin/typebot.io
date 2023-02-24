-- DropIndex
DROP INDEX "Result_typebotId_idx";

-- AlterTable
ALTER TABLE "Typebot" ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]';

-- CreateIndex
CREATE INDEX "Result_typebotId_hasStarted_createdAt_idx" ON "Result"("typebotId", "hasStarted", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Result_typebotId_isCompleted_idx" ON "Result"("typebotId", "isCompleted");

-- CreateIndex
CREATE INDEX "Typebot_isArchived_createdAt_idx" ON "Typebot"("isArchived", "createdAt" DESC);
