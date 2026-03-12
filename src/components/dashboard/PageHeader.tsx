import { ReactNode } from "react";

interface PageHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ breadcrumbs, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div
      className="px-4 md:px-8 py-4 md:py-6"
      style={{
        background: 'hsl(var(--mt-surface-0))',
        borderBottom: '1px solid hsl(var(--mt-border))',
      }}
    >
      {/* Breadcrumb - hide on mobile */}
      <div className="hidden md:flex items-center gap-1.5 mb-2">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ color: 'hsl(var(--mt-gold))' }} className="text-xs">/</span>}
            <span className="text-xs" style={{ color: 'hsl(var(--mt-text-muted))' }}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="mt-display text-xl md:text-2xl">{title}</h1>
          {subtitle && <p className="mt-body mt-1 text-sm md:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
