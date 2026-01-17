-- Create artifacts table
-- Stores generated CV versions, cover letters, message drafts

create table artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade,
  type text not null check (type in ('cv', 'cover_letter', 'message')),
  content text not null,
  version text default '1.0',
  model text, -- AI model used (e.g., 'gpt-4', 'gpt-3.5-turbo')
  prompt_version text,
  approved boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create indexes
create index idx_artifacts_user_id on artifacts(user_id);
create index idx_artifacts_job_id on artifacts(job_id);
create index idx_artifacts_type on artifacts(type);
create index idx_artifacts_approved on artifacts(approved);
create index idx_artifacts_user_type on artifacts(user_id, type);
create index idx_artifacts_created_at on artifacts(created_at desc);

-- Enable RLS
alter table artifacts enable row level security;

-- RLS Policies
create policy "Users can view own artifacts"
  on artifacts for select
  using (auth.uid() = user_id);

create policy "Users can insert own artifacts"
  on artifacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own artifacts"
  on artifacts for update
  using (auth.uid() = user_id);

create policy "Users can delete own artifacts"
  on artifacts for delete
  using (auth.uid() = user_id);

-- Trigger to auto-update updated_at
create trigger update_artifacts_updated_at
  before update on artifacts
  for each row
  execute function update_updated_at_column();
