import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
}

function DefaultIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" stroke="hsl(213, 65%, 15%)" strokeWidth="1" opacity="0.15" />
      <circle cx="40" cy="40" r="20" stroke="hsl(42, 64%, 45%)" strokeWidth="1" opacity="0.25" />
      <path d="M40 20L52 28V44L40 52L28 44V28L40 20Z" stroke="hsl(213, 65%, 15%)" strokeWidth="1.5" opacity="0.2" fill="none" />
      <circle cx="40" cy="36" r="4" fill="hsl(42, 64%, 45%)" opacity="0.3" />
    </svg>
  );
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">{icon || <DefaultIcon />}</div>
      <h3 className="mt-heading mb-2">{title}</h3>
      <p className="mt-body max-w-sm">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6"
          style={{ background: 'hsl(var(--mt-gold))', color: 'white' }}
        >
          {action.label} →
        </Button>
      )}
    </div>
  );
}
