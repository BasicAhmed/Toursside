import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap"><div className="page-head" style={{ paddingBottom: 120 }}>
      <h1>This page doesn't exist</h1>
      <p className="lede">The address may have changed. Start again from the homepage.</p>
      <div className="cta-row"><Link href="/" className="btn btn-primary">Go to the homepage</Link></div>
    </div></div>
  );
}
