# Supabase setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase-table.sql`.
3. Confirm Storage has a public bucket named `love-site-images`.
4. Open `js/supabase-config.js` and fill in:
   - `url`: your project URL
   - `anonKey`: your anon public key
   - `table`: keep `love_site_content`
   - `bucket`: keep `love-site-images`
   - `siteKey`: use `default` or your own key
5. Open `editor.html`, upload images, edit text, and click save.
6. Open `index.html` to verify the cloud content loads.

Notes:
- The current demo uses the anon key directly in the browser, so anyone who knows the site can update content unless you tighten Supabase policies later.
- This is fine for a quick personal site, but if you want only yourself to edit, the next step is adding Supabase Auth and stricter RLS.
- If Supabase is not configured, the site falls back to browser local storage and share links.
- `supabase-table.sql` now also creates the `love-site-images` bucket and the matching `storage.objects` read/upload/update policies. If you created the bucket earlier without policies, rerun that SQL once.
