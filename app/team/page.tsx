import { PageHeader, StatusBadge } from "@/components/ui";
import { listTeamMembers } from "@/lib/data/team";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await listTeamMembers();
  return <div className="page-wrap"><PageHeader eyebrow="Account" title="Your Team" description="See who owns each next step and the access level they hold." /><section className="team-grid">{members.map((member) => <article className="team-card" key={member.id}><span className="team-avatar">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><h2>{member.name}</h2><p>{member.email || "No email added"}</p><StatusBadge value={member.role} /></div></article>)}</section>{!members.length && <div className="quiet-state">No team members have been added yet.</div>}<section className="permission-note"><p className="eyebrow">Demo access</p><h2>Roles at a glance</h2><div><p><strong>Owner</strong> sees all leads, performance, support, and account settings.</p><p><strong>Manager</strong> manages leads, assignments, follow-ups, and performance.</p><p><strong>Staff</strong> handles assigned leads, notes, and follow-ups.</p></div></section></div>;
}

