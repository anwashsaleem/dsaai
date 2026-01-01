import { LucideIcon } from 'lucide-react';

interface TopBarProps {
  title: string;
  subLine: string;
  icon: LucideIcon;
  iconColor: string;
  maxWidth?: string;
}

export function TopBar({ title, subLine, icon: Icon, iconColor, maxWidth = 'max-w-2xl' }: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
      <div className={`${maxWidth} mx-auto w-full`}>
        <div className="flex items-center gap-4">
          <Icon className="w-10 h-10" style={{ color: iconColor }} strokeWidth={2.5} />
          <div className="flex flex-col text-left justify-center">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary leading-none mb-1">{title}</h1>
            <p className="text-sm text-text-secondary dark:text-text-secondary font-bold leading-none">{subLine}</p>
          </div>
        </div>
      </div>
    </div>
  );
}