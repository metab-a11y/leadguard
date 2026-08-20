create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  customer_name text not null,
  company text,
  phone text,
  email text,
  enquiry_date timestamptz not null default now(),
  source text not null default 'Website',
  product_service text,
  summary text,
  status text not null default 'New',
  priority text not null default 'Normal',
  assigned_to text,
  last_contact timestamptz,
  next_follow_up timestamptz,
  quotation_status text default 'None',
  value numeric,
  notes text,
  health text default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table leads enable row level security;
drop policy if exists "leads_v1_read" on leads;
create policy "leads_v1_read" on leads for select using (true);
drop policy if exists "leads_v1_write" on leads;
create policy "leads_v1_write" on leads for all using (true) with check (true);

create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  lead_id uuid references leads(id) on delete cascade,
  due_date timestamptz not null,
  responsible_person text,
  recommended_action text,
  notes text,
  priority text not null default 'Normal',
  status text not null default 'Upcoming',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table follow_ups enable row level security;
drop policy if exists "follow_ups_v1_read" on follow_ups;
create policy "follow_ups_v1_read" on follow_ups for select using (true);
drop policy if exists "follow_ups_v1_write" on follow_ups;
create policy "follow_ups_v1_write" on follow_ups for all using (true) with check (true);

create table if not exists timeline_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  lead_id uuid references leads(id) on delete cascade,
  entry_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);
alter table timeline_entries enable row level security;
drop policy if exists "timeline_entries_v1_read" on timeline_entries;
create policy "timeline_entries_v1_read" on timeline_entries for select using (true);
drop policy if exists "timeline_entries_v1_write" on timeline_entries;
create policy "timeline_entries_v1_write" on timeline_entries for all using (true) with check (true);

create table if not exists performance_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  service_area text not null,
  period text not null,
  metric_key text not null,
  metric_value numeric not null,
  metric_label text,
  ai_source text,
  ai_confidence numeric,
  review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);
alter table performance_metrics enable row level security;
drop policy if exists "performance_metrics_v1_read" on performance_metrics;
create policy "performance_metrics_v1_read" on performance_metrics for select using (true);
drop policy if exists "performance_metrics_v1_write" on performance_metrics;
create policy "performance_metrics_v1_write" on performance_metrics for all using (true) with check (true);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  role text not null default 'Staff',
  email text,
  created_at timestamptz not null default now()
);
alter table team_members enable row level security;
drop policy if exists "team_members_v1_read" on team_members;
create policy "team_members_v1_read" on team_members for select using (true);
drop policy if exists "team_members_v1_write" on team_members;
create policy "team_members_v1_write" on team_members for all using (true) with check (true);

insert into leads (customer_name, company, phone, email, source, product_service, summary, status, priority, assigned_to, last_contact, next_follow_up, quotation_status, value, health) values
('James Tan', 'ABC Engineering', '+65 9123 4567', 'james@abceng.com', 'Website', 'Website Revamp', 'Asked for website revamp pricing for 8-page site', 'Quotation Sent', 'Important', 'Sarah Lee', now() - interval '6 days', now() - interval '2 days', 'Sent', 4500, 'Needs Attention'),
('Sarah Lee', 'Greenfield Plumbing', '+65 9876 5432', 'sarah@greenfield.sg', 'Chatbot', 'SEO + AEO', 'Wants SEO services, found us via chatbot', 'New', 'Urgent', null, null, now() + interval '1 day', 'None', null, 'Needs Attention'),
('David Wong', 'Wong & Co', '+65 8234 5678', 'david@wongco.com', 'Voice Assistant', 'AI Voice Assistant', 'Called about voice assistant for after-hours', 'Contacted', 'Normal', 'James Tan', now() - interval '3 days', now() + interval '3 days', 'None', null, 'Active'),
('Mei Chen', 'Bloom Florist', '+65 9555 1234', 'mei@bloom.sg', 'Search', 'SEO + AEO', 'Found us on Google, wants AEO package', 'Qualified', 'Important', 'Sarah Lee', now() - interval '1 day', null, 'None', 3200, 'Active'),
('Robert Lim', 'Lim Auto Services', '+65 8111 2222', 'robert@limauto.sg', 'Phone', 'Website Revamp', 'Called asking about website redesign', 'Won', 'Normal', 'James Tan', now() - interval '10 days', null, 'Accepted', 5200, 'Closed'),
('Priya Kumar', 'Kumar Legal', '+65 9009 8888', 'priya@kumarlegal.sg', 'Referral', 'AI Chatbot', 'Referred by existing client, wants chatbot', 'Follow-Up', 'Important', 'Sarah Lee', now() - interval '8 days', now() - interval '1 day', 'Sent', 3800, 'At Risk')
on conflict do nothing;

insert into follow_ups (lead_id, due_date, responsible_person, recommended_action, notes, priority, status) values
((select id from leads where customer_name = 'James Tan'), now() - interval '2 days', 'Sarah Lee', 'Check if customer has questions about the quotation', 'Quotation sent 6 days ago', 'Urgent', 'Overdue'),
((select id from leads where customer_name = 'Sarah Lee'), now() + interval '1 day', 'Sarah Lee', 'Initial response needed — website enquiry received', 'No response recorded yet', 'Urgent', 'Due Today'),
((select id from leads where customer_name = 'David Wong'), now() + interval '3 days', 'James Tan', 'Send proposal for voice assistant setup', 'Customer showed interest', 'Normal', 'Upcoming'),
((select id from leads where customer_name = 'Priya Kumar'), now() - interval '1 day', 'Sarah Lee', 'Follow up on quotation — no response in 8 days', 'Quotation sent, no reply', 'Important', 'Overdue')
on conflict do nothing;

insert into timeline_entries (lead_id, entry_type, content) values
((select id from leads where customer_name = 'James Tan'), 'enquiry', 'Website enquiry received'),
((select id from leads where customer_name = 'James Tan'), 'response', 'Initial response recorded'),
((select id from leads where customer_name = 'James Tan'), 'quotation', 'Quotation sent — $4,500 for 8-page website revamp'),
((select id from leads where customer_name = 'James Tan'), 'followup', 'Follow-up scheduled but overdue'),
((select id from leads where customer_name = 'Sarah Lee'), 'enquiry', 'Chatbot enquiry received — interested in SEO'),
((select id from leads where customer_name = 'Sarah Lee'), 'note', 'No response recorded yet — needs attention'),
((select id from leads where customer_name = 'David Wong'), 'enquiry', 'Voice assistant call received after hours'),
((select id from leads where customer_name = 'David Wong'), 'response', 'Initial call returned, customer interested'),
((select id from leads where customer_name = 'Mei Chen'), 'enquiry', 'Search enquiry — found us on Google'),
((select id from leads where customer_name = 'Mei Chen'), 'note', 'Qualified lead — budget confirmed, ready for quotation'),
((select id from leads where customer_name = 'Priya Kumar'), 'enquiry', 'Referral from existing client — wants AI chatbot'),
((select id from leads where customer_name = 'Priya Kumar'), 'quotation', 'Quotation sent — $3,800 for chatbot implementation'),
((select id from leads where customer_name = 'Priya Kumar'), 'followup', 'Follow-up overdue — no response in 8 days')
on conflict do nothing;

insert into performance_metrics (service_area, period, metric_key, metric_value, metric_label) values
('website', to_char(now() - interval '2 months', 'YYYY-MM'), 'enquiries_count', 18, '18 enquiries came through your website'),
('website', to_char(now() - interval '1 month', 'YYYY-MM'), 'enquiries_count', 24, '24 enquiries came through your website — up from 18'),
('website', to_char(now(), 'YYYY-MM'), 'enquiries_count', 15, '15 enquiries so far this month'),
('seo_aeo', to_char(now() - interval '1 month', 'YYYY-MM'), 'search_visibility', 62, 'Your website appeared in more searches this month'),
('seo_aeo', to_char(now(), 'YYYY-MM'), 'search_visibility', 48, 'Fewer people clicked through from search this month'),
('chatbot', to_char(now(), 'YYYY-MM'), 'conversations_handled', 87, 'Chatbot handled 87 conversations this month'),
('chatbot', to_char(now(), 'YYYY-MM'), 'enquiries_captured', 31, '31 enquiries captured by chatbot'),
('chatbot', to_char(now(), 'YYYY-MM'), 'after_hours_enquiries', 9, '9 enquiries came in after hours'),
('voice', to_char(now(), 'YYYY-MM'), 'calls_handled', 42, 'Voice assistant handled 42 calls'),
('voice', to_char(now(), 'YYYY-MM'), 'enquiries_captured', 14, '14 enquiries captured from calls'),
('voice', to_char(now(), 'YYYY-MM'), 'after_hours_calls', 11, '11 calls handled after hours'),
('voice', to_char(now(), 'YYYY-MM'), 'needs_human_followup', 5, '5 callers still need human follow-up')
on conflict do nothing;

insert into team_members (name, role, email) values
('Sarah Lee', 'Owner', 'sarah@abcstudio.example'),
('James Tan', 'Manager', 'james@abcstudio.example'),
('Mei Chen', 'Staff', 'mei@abcstudio.example')
on conflict do nothing;