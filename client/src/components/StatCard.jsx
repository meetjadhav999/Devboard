export default function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#f3f4f6',
      borderRadius: '12px',
      padding: '1.2rem',
      textAlign: 'center',
      minWidth: '120px'
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#111' }}>
        {value ?? '—'}
      </div>
      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}