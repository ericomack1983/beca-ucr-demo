export default function IssuerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-open-sans, "Open Sans", system-ui, sans-serif)' }}>
      {children}
    </div>
  );
}
