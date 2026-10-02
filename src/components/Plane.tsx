export default function Plane({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M3 21 45 3 30 45l-6-19z" fill="#FF8A3D" />
      <path d="M24 26 45 3 30 45z" fill="#F2762A" />
    </svg>
  );
}
