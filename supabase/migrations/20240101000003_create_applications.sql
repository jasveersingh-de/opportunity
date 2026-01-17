-- Create applications table
-- Links jobs to application pipeline state

create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade not null,
  status text default 'saved' not null check (status in ('saved', 'applied', 'interview', 'offer', 'rejected')),
  applied_at timestamptz,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, job_id)
);

-- Create indexes
create index idx_applications_user_id on applications(user_id);
create index idx_applications_status on applications(status);
create index idx_applications_job_id on applications(job_id);
create index idx_applications_user_status on applications(user_id, status);
create index idx_applications_applied_at on applications(applied_at desc nulls last);

-- Enable RLS
alter table applications enable row level security;

-- RLS Policies
create policy "Users can view own applications"
  on applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on applications for delete
  using (auth.uid() = user_id);

-- Trigger to auto-update updated_at
create trigger update_applications_updated_at
  before update on applications
  for each row
  execute function update_updated_at_column();
