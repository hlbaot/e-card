-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "avatar_size" AS ENUM ('sm', 'md', 'lg');

-- CreateEnum
CREATE TYPE "avatar_shape" AS ENUM ('circle', 'rounded');

-- CreateEnum
CREATE TYPE "button_style" AS ENUM ('filled', 'soft', 'outline');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "refresh_token_hash" CHAR(64),
    "refresh_expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(120) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "position" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "zalo" VARCHAR(30),
    "slogan" VARCHAR(255),
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "allow_indexing" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_themes" (
    "employee_id" UUID NOT NULL,
    "template_id" VARCHAR(32) NOT NULL,
    "background_id" VARCHAR(32) NOT NULL,
    "primary_color" VARCHAR(7) NOT NULL,
    "avatar_size" "avatar_size" NOT NULL DEFAULT 'lg',
    "avatar_shape" "avatar_shape" NOT NULL DEFAULT 'circle',
    "button_style" "button_style" NOT NULL DEFAULT 'soft',
    "decor" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "shapes" JSONB NOT NULL DEFAULT '{}',
    "show_decor" BOOLEAN NOT NULL DEFAULT true,
    "decor_opacity" SMALLINT NOT NULL DEFAULT 65,

    CONSTRAINT "card_themes_pkey" PRIMARY KEY ("employee_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_slug_key" ON "employees"("slug");

-- CreateIndex
CREATE INDEX "idx_employees_public_list" ON "employees"("is_active", "deleted_at");

-- AddForeignKey
ALTER TABLE "card_themes" ADD CONSTRAINT "card_themes_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Database constraints not expressible in the Prisma schema.
ALTER TABLE "card_themes"
    ADD CONSTRAINT "chk_card_themes_primary_color"
        CHECK ("primary_color" ~ '^#[0-9A-Fa-f]{6}$'),
    ADD CONSTRAINT "chk_card_themes_decor_opacity"
        CHECK ("decor_opacity" BETWEEN 0 AND 100);

-- Keep timestamps correct for both Prisma and direct SQL updates.
CREATE FUNCTION "set_updated_at"() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "admin_users_set_updated_at"
BEFORE UPDATE ON "admin_users"
FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

CREATE TRIGGER "employees_set_updated_at"
BEFORE UPDATE ON "employees"
FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();
