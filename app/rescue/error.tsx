"use client";
export default function RescueError({ reset }: { reset: () => void }) { return <div className="page-wrap"><div className="empty-state"><span>!</span><h1>Something went wrong loading Lead Rescue.</h1><p>Your existing data is safe. Please try again.</p><button className="button primary" onClick={reset}>Try again</button></div></div>; }

