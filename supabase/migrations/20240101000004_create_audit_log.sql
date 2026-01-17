-- Create audit_log table
-- Audit trail for all important actions

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null, -- 'create', 'update', 'delete', 'generate_cv', etc.
  resource text not null, -- 'job', 'application', 'cv', etc.
  resource_id uuid,
  metadata jsonb,
  created_at timestamptz default now() not null
);

-- Create indexes
create index idx_audit_log_user_id on audit_log(user_id);
create index idx_audit_log_resource on audit_log(resource, resource_id);
create index idx_audit_log_created_at on audit_log(created_at desc);
create index idx_audit_log_action on audit_log(action);
create index idx_audit_log_user_created on audit_log(user_id, created_at desc);

-- Enable RLS
alter table audit_log enable row level security;

-- RLS Policies
-- Users can only view their own audit logs
create policy "Users can view own audit logs"
  on audit_log for select
  using (auth.uid() = user_id);

-- Only service role can insert audit logs (enforced at application level)
-- No insert policy for authenticated users - use service role key server-side
