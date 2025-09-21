'use client';

import type { HttpMethod } from '@/entities/http-request';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { HTTP_METHODS } from '../model/constants';
import { MethodBadge } from './MethodBadge';

type MethodSelectorProps = {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
};

export const MethodSelector = ({ value, onChange }: MethodSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-32'>
        <SelectValue>
          <MethodBadge method={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {HTTP_METHODS.map(method => (
          <SelectItem key={method.value} value={method.value}>
            <MethodBadge method={method.value} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
