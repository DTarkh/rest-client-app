'use client';
import { useLang } from '@/src/entities/i18n';
import { cn } from '@/src/shared/lib/cn';
import { UiSelect } from '@/src/shared/ui/lang-select';
import type { Lang } from '@/src/entities/i18n';

type LangOption = {
  id: Lang;
  label: string;
};

const langOptions: LangOption[] = [
  { id: 'en', label: 'En' },
  { id: 'ru', label: 'Ru' },
];

export function UpdateLang({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  const langOption = langOptions.find(option => option.id === lang);
  const onChangeLang = (lang: LangOption) => {
    setLang(lang.id);
  };

  return (
    <UiSelect
      className={cn(className)}
      widthClassName='w-[50px]'
      options={langOptions}
      value={langOption}
      onChange={onChangeLang}
      getLabel={option => option.label}
    />
  );
}
