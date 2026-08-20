import { PageHeader } from "@/components/ui";
export default function ProfilePage() { return <div className="page-wrap"><PageHeader eyebrow="Account" title="Profile" description="The demo workspace uses Sarah Lee as its activity owner." /><section className="detail-card profile-card"><span className="team-avatar large">SL</span><div><h2>Sarah Lee</h2><p>Owner · sarah@abcstudio.example</p><p className="quiet-copy">Profile editing becomes available when this demo is locked down for real client accounts.</p></div></section></div>; }

