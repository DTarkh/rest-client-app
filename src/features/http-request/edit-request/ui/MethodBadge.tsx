'use client';

import type { HttpMethod } from '@/entities/http-request';
import { getMethodConfig } from '../model/constants';

type MethodBadgeProps = {
  method: HttpMethod;
  className?: string;
};

export const MethodBadge = ({ method, className = '' }: MethodBadgeProps) => {
  const config = getMethodConfig(method);

  return (
    <div
      className={`px-2 py-1 rounded text-sm font-semibold ${config.color} ${config.bgColor} ${className}`}
    >
      {config.label}
    </div>
  );
};
