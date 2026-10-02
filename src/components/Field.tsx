"use client";
type Props = { id: string; label: string; optional?: boolean; value: string; error?: string; onChange: (v: string) => void; type?: string; autoComplete?: string; placeholder?: string; options?: string[]; textarea?: boolean; full?: boolean; inputMode?: "tel" | "email" | "text" | "url" };

export default function Field({ id, label, optional, value, error, onChange, type = "text", autoComplete, placeholder, options, textarea, full, inputMode }: Props) {
  const common = { id: `f-${id}`, name: id, value, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `e-${id}` : undefined, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(e.target.value) };
  return (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={`f-${id}`}>{label}{optional ? <em> (optional)</em> : null}</label>
      {options ? (
        <select {...common}><option value="">Choose one</option>{options.map((o) => <option key={o}>{o}</option>)}</select>
      ) : textarea ? (
        <textarea {...common} placeholder={placeholder} rows={4} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} placeholder={placeholder} inputMode={inputMode} />
      )}
      {error ? <p className="err" id={`e-${id}`}>{error}</p> : null}
    </div>
  );
}
