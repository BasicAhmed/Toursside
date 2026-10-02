import Link from "next/link";

export function Sent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel result" role="status" tabIndex={-1} id="result">
      <div className="badge" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0B6F6D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg></div>
      <h2>{title}</h2>
      {children}
      <div className="cta-row"><Link href="/" className="btn btn-ghost">Back to the homepage</Link></div>
    </div>
  );
}

export function ViaWhatsApp({ url, what, onBack }: { url: string; what: string; onBack: () => void }) {
  return (
    <div className="panel result warn" role="alert" tabIndex={-1} id="result">
      <div className="badge" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B4560F" strokeWidth="2.4" strokeLinecap="round"><path d="M12 7v6M12 17h.01" /></svg></div>
      <h2>Send your {what} on WhatsApp</h2>
      <p>We couldn't deliver it by email from this page, so it has not reached us yet. Your answers are ready in a WhatsApp message. Send it and we'll reply there.</p>
      <div className="cta-row">
        <a className="btn btn-primary" href={url} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
        <button type="button" className="btn btn-ghost" onClick={onBack}>Back to the form</button>
      </div>
    </div>
  );
}
