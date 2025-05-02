CREATE TYPE "public"."status_enum" AS ENUM('public', 'private');--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "status" "status_enum" DEFAULT 'private';