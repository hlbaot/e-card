-- Add index on refresh_token_hash for fast session lookup during refresh and logout.
CREATE INDEX "idx_admin_users_refresh_token_hash" ON "admin_users"("refresh_token_hash");
