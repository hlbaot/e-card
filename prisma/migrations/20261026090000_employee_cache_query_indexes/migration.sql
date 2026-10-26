-- Extend the public-list prefix index to cover its stable sort; retain UUID/slug unique indexes.
DROP INDEX "idx_employees_public_list";
CREATE INDEX "idx_employees_public_list" ON "employees"("is_active", "deleted_at", "created_at", "id");
CREATE INDEX "idx_employees_admin_order" ON "employees"("deleted_at", "created_at" DESC, "id");
