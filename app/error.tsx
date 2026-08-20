"use client";
export default function AppError({ reset }: { reset: () => void }) { return <div className="page-wrap"><div className="empty-state"><span>!</span><h1>Something went wrong loading this page.</h1><p>Your existing data is safe. Try again shortly.</p><button className="button primary" onClick={reset}>Try again</button></div></div>; }

