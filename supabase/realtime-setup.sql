alter table public."PlatformPrice" enable row level security;

alter publication supabase_realtime add table "PlatformPrice";

alter table public."PlatformPrice" replica identity full;

create policy "Public read access for platform prices"
on public."PlatformPrice"
for select
to anon, authenticated
using (true);
