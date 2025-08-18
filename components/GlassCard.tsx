
import React, { forwardRef } from 'react';

type GlassCardProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
> & {
  className?: string;
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`glass-card rounded-2xl p-8 sm:p-10 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;