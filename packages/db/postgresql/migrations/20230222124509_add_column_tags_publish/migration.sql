-- AlterTable
ALTER TABLE "PublicTypebot" ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]';
