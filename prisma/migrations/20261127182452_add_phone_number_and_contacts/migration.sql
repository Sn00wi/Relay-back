-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT;

-- CreateTable
CREATE TABLE "contacts" (
    "owner_id" TEXT NOT NULL,
    "contact_user_id" TEXT NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("owner_id","contact_user_id")
);

-- CreateIndex
CREATE INDEX "contacts_contact_user_id_idx" ON "contacts"("contact_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_user_id_fkey" FOREIGN KEY ("contact_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
