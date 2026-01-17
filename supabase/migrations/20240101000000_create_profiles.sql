-- Create profiles table
-- Stores user preferences, countries, role targets

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  preferred_countries text[] default '{}',
  target_roles text[] default '{}',
  seniority_level text check (seniority_level in ('junior', 'mid', 'senior', 'lead', 'principal')),
  remote_preference text check (remote_preference in ('remote', 'hybrid', 'onsite', 'any')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- Create indexes
create index idx_profiles_user_id on profiles(user_id);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own profile"
  on profiles for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();
