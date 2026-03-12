export function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="px-8 py-6" style={{ background: 'hsl(var(--mt-surface-0))', borderBottom: '1px solid hsl(var(--mt-border))' }}>
        <div className="skeleton h-3 w-32 mb-3" />
        <div className="skeleton h-8 w-64 mb-2" />
        <div className="skeleton h-4 w-48" />
      </div>
      <div className="px-8 py-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-kpi">
              <div className="pl-3 space-y-2">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card-section">
            <div className="card-section-header"><div className="skeleton h-5 w-40" /></div>
            <div className="card-section-body"><div className="skeleton h-52 w-full" /></div>
          </div>
          <div className="card-section">
            <div className="card-section-header"><div className="skeleton h-5 w-24" /></div>
            <div className="card-section-body space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
