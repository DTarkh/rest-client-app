import { ReactNode, useId, useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/cn';

type BaseOption = {
  id: string | number;
};

export type UiSelectProps<T extends BaseOption | undefined> = {
  className?: string;
  options?: T[];
  value?: T;
  onChange: (value: T) => void;
  label?: string;
  error?: string;
  getLabel: (value: T) => string;
  renderPreview?: (value?: T) => ReactNode;
  renderOption?: (value: T, o: { selected?: boolean; active?: boolean }) => ReactNode;
  widthClassName?: string;
};

export function UiSelect<T extends BaseOption | undefined>({
  onChange,
  value,
  options,
  className,
  label,
  error,
  getLabel,
  renderPreview,
  renderOption = o => getLabel(o),
  widthClassName,
}: UiSelectProps<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (options && options.length > 0) {
        if (e.key === 'ArrowDown') {
          setActiveIdx(idx => (idx === null ? 0 : Math.min(idx + 1, options.length - 1)));
        }
        if (e.key === 'ArrowUp') {
          setActiveIdx(idx => (idx === null ? options.length - 1 : Math.max(idx - 1, 0)));
        }
        if (e.key === 'Enter' && activeIdx !== null) {
          const selected = options[activeIdx];
          if (selected) {
            onChange(selected);
            setOpen(false);
          }
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, options, activeIdx, onChange]);

  useEffect(() => {
    if (open && value && options) {
      const idx = options.findIndex(opt => opt?.id === value?.id);
      setActiveIdx(idx >= 0 ? idx : null);
    }
  }, [open, value, options]);

  const ArrowIcon = (
    <svg
      width={20}
      height={20}
      className='ml-auto text-gray-400'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        d='M6 8l4 4 4-4'
        stroke='currentColor'
        strokeWidth={2}
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );

  return (
    <div
      className={cn(className, widthClassName, 'flex flex-col gap-1')}
      ref={containerRef}
      tabIndex={-1}
    >
      {label && (
        <label htmlFor={id} className='block'>
          {label}
        </label>
      )}

      <button
        id={id}
        type='button'
        className={cn(
          'relative rounded border border-slate-300  h-8 outline-none z-10 w-full bg-transparent flex items-center px-2 transition',
        )}
        onClick={() => setOpen(v => !v)}
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        {renderPreview?.(value) ??
          (value && <div className='whitespace-nowrap'>{getLabel(value)}</div>)}
        {ArrowIcon}
      </button>
      {open && (
        <ul
          role='listbox'
          tabIndex={-1}
          className={cn(
            'absolute -bottom-[42px] max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 z-20 sm:text-sm',
            widthClassName,
          )}
        >
          {options?.length ? (
            options.map((option, idx) => {
              const selected = value?.id === option?.id;
              const active = idx === activeIdx;
              return (
                <li
                  key={option?.id ?? 'empty'}
                  role='option'
                  aria-selected={selected}
                  className={cn(
                    'relative flex cursor-pointer select-none p-1',
                    active && 'bg-gray-100 ',
                    selected && 'bg-gray-300 ',
                    !active && !selected && 'text-slate-900',
                  )}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                  onClick={() => {
                    onChange(option as T);
                    setOpen(false);
                  }}
                >
                  {renderOption(option, { selected, active })}
                </li>
              );
            })
          ) : (
            <li className='p-4 text-slate-400'>No options</li>
          )}
        </ul>
      )}

      {error && <div className='text-rose-400 text-sm'>{error}</div>}
    </div>
  );
}
