-- Create jobs table
-- Stores ingested job postings

create table jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  company text not null,
  url text,
  description text,
  country text, -- ISO country code (e.g., 'US', 'GB')
  location text, -- City/region
  remote_type text check (remote_type in ('remote', 'hybrid', 'onsite')),
  salary_min integer,
  salary_max integer,
  currency text default 'USD',
  rank_score numeric, -- AI-generated ranking score (0-100)
  status text default 'saved' check (status in ('saved', 'applied', 'interview', 'offer', 'rejected')),
  ingested_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create indexes
create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_country on jobs(country);
create index idx_jobs_rank_score on jobs(rank_score desc nulls last);
create index idx_jobs_user_status on jobs(user_id, status);
create index idx_jobs_user_country on jobs(user_id, country);
create index idx_jobs_created_at on jobs(created_at desc);

-- Partial index for active jobs
create index idx_jobs_active on jobs(user_id) 
where status in ('saved', 'applied');

-- Enable RLS
alter table jobs enable row level security;

-- RLS Policies
create policy "Users can view own jobs"
  on jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on jobs for delete
  using (auth.uid() = user_id);

-- Trigger to auto-update updated_at
create trigger update_jobs_updated_at
  before update on jobs
  for each row
  execute function update_updated_at_column();
