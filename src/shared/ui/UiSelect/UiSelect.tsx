import { ReactNode, useId, useState, useRef, useEffect } from 'react';
import { clsx } from '../../lib/clsx';

// Тип для элементов списка
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

/**
 * Кастомный выпадающий список, без сторонних библиотек.
 * Все стили реализованы через tailwindcss классы.
 */
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
  const [open, setOpen] = useState(false); // Состояние для открытия списка
  const [activeIdx, setActiveIdx] = useState<number | null>(null); // Активный элемент для навигации
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне компонента
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

  // Закрытие по Escape и навигация стрелками
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

  // Получение индекса выбранного элемента для навигации
  useEffect(() => {
    if (open && value && options) {
      const idx = options.findIndex(opt => opt?.id === value?.id);
      setActiveIdx(idx >= 0 ? idx : null);
    }
  }, [open, value, options]);

  // Иконка стрелки вниз (SVG, не библиотечная)
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
      className={clsx(className, widthClassName, 'flex flex-col gap-1')}
      ref={containerRef}
      tabIndex={-1}
    >
      {label && (
        <label htmlFor={id} className='block'>
          {label}
        </label>
      )}

      {/* Кнопка выбора */}
      <button
        id={id}
        type='button'
        className={clsx(
          'relative rounded border border-slate-300 focus:border-teal-600 h-10 outline-none z-10 w-full bg-transparent flex items-center px-2 transition',
          open && 'border-teal-600',
        )}
        onClick={() => setOpen(v => !v)}
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        {/* Превью выбранного элемента */}
        {renderPreview?.(value) ??
          (value && <div className='whitespace-nowrap'>{getLabel(value)}</div>)}
        {ArrowIcon}
      </button>
      {/* Список вариантов */}
      {open && (
        <ul
          role='listbox'
          tabIndex={-1}
          className={clsx(
            'absolute mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 z-20 sm:text-sm',
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
                  className={clsx(
                    'relative flex cursor-pointer select-none p-4',
                    active && 'bg-teal-600 text-white',
                    selected && 'bg-teal-500 text-white',
                    !active && !selected && 'text-slate-900',
                  )}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                  onClick={() => {
                    onChange(option as T);
                    setOpen(false);
                  }}
                >
                  {/* Отображение варианта */}
                  {renderOption(option, { selected, active })}
                </li>
              );
            })
          ) : (
            <li className='p-4 text-slate-400'>Нет вариантов</li>
          )}
        </ul>
      )}

      {error && <div className='text-rose-400 text-sm'>{error}</div>}
    </div>
  );
}
