create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  category text not null,
  subject text not null,
  description text not null,
  priority text not null default 'Normal',
  status text not null default 'Received',
  submitted_by text,
  abcstudio_response text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table support_requests enable row level security;
drop policy if exists "support_requests_v1_read" on support_requests;
create policy "support_requests_v1_read" on support_requests for select using (true);
drop policy if exists "support_requests_v1_write" on support_requests;
create policy "support_requests_v1_write" on support_requests for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'Demo user',
  action text not null,
  target_type text not null,
  target_id uuid,
  risk_level text not null default 'low',
  approved_by text,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for insert with check (true);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  category text not null,
  observation text not null,
  why_it_matters text not null,
  recommended_action text not null,
  priority text not null default 'Normal',
  status text not null default 'Open',
  created_at timestamptz not null default now()
);
alter table recommendations enable row level security;
drop policy if exists "recommendations_v1_read" on recommendations;
create policy "recommendations_v1_read" on recommendations for select using (true);
drop policy if exists "recommendations_v1_write" on recommendations;
create policy "recommendations_v1_write" on recommendations for all using (true) with check (true);

insert into recommendations (category, observation, why_it_matters, recommended_action, priority)
select 'Lead Flow', 'Several open quotations are waiting for a follow-up.', 'Customers may still be deciding and could need one clear answer before moving forward.', 'Review open quotations and schedule a personal follow-up this week.', 'Important'
where not exists (select 1 from recommendations where category = 'Lead Flow');

insert into recommendations (category, observation, why_it_matters, recommended_action, priority)
select 'Website', 'Website enquiries are arriving from several service pages.', 'The strongest enquiry paths show where customer intent is already high.', 'Review the pages generating enquiries and make their next step even clearer.', 'Normal'
where not exists (select 1 from recommendations where category = 'Website');

insert into performance_metrics (service_area, period, metric_key, metric_value, metric_label)
select 'seo_aeo', to_char(now() - interval '2 months', 'YYYY-MM'), 'search_visibility', 51, 'Your search visibility began improving two months ago'
where not exists (select 1 from performance_metrics where service_area = 'seo_aeo' and period = to_char(now() - interval '2 months', 'YYYY-MM') and metric_key = 'search_visibility');

insert into performance_metrics (service_area, period, metric_key, metric_value, metric_label)
select 'chatbot', to_char(now() - interval '1 month', 'YYYY-MM'), 'conversations_handled', 72, 'Chatbot handled 72 conversations last month'
where not exists (select 1 from performance_metrics where service_area = 'chatbot' and period = to_char(now() - interval '1 month', 'YYYY-MM') and metric_key = 'conversations_handled');

insert into performance_metrics (service_area, period, metric_key, metric_value, metric_label)
select 'chatbot', to_char(now() - interval '2 months', 'YYYY-MM'), 'conversations_handled', 64, 'Chatbot handled 64 conversations two months ago'
where not exists (select 1 from performance_metrics where service_area = 'chatbot' and period = to_char(now() - interval '2 months', 'YYYY-MM') and metric_key = 'conversations_handled');

insert into performance_metrics (service_area, period, metric_key, metric_value, metric_label)
select 'voice', to_char(now() - interval '1 month', 'YYYY-MM'), 'calls_handled', 36, 'Voice assistant handled 36 calls last month'
where not exists (select 1 from performance_metrics where service_area = 'voice' and period = to_char(now() - interval '1 month', 'YYYY-MM') and metric_key = 'calls_handled');

insert into performance_metrics (service_area, period, metric_key, metric_value, metric_label)
select 'voice', to_char(now() - interval '2 months', 'YYYY-MM'), 'calls_handled', 29, 'Voice assistant handled 29 calls two months ago'
where not exists (select 1 from performance_metrics where service_area = 'voice' and period = to_char(now() - interval '2 months', 'YYYY-MM') and metric_key = 'calls_handled');
