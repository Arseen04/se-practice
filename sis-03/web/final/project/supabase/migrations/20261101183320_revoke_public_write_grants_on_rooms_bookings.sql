/*
# Revoke write privileges from public roles on rooms and bookings

1. Modified Tables
- `rooms` and `bookings`: INSERT, UPDATE, DELETE and TRUNCATE are revoked from `anon` and `authenticated`.

2. Security
- Project default privileges had granted the public roles full write access to new tables.
- Row level security already blocked those writes, but the grants are removed so the database itself refuses them.
- SELECT grants and the read-only policies are unchanged, so the page can still show the room and bookings.

3. Important notes
- Re-running this migration is safe; revoking a privilege that is already absent does nothing.
*/

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON rooms FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON bookings FROM anon, authenticated;
