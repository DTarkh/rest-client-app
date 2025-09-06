'use client';
import { cn } from '../../../shared/lib/cn';
import { UiSelect } from '../../../shared/ui/UiSelect/UiSelect';
import { Lang, useLang } from '../model/lang.store';

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
      widthClassName='w-[80px]'
      options={langOptions}
      value={langOption}
      onChange={onChangeLang}
      getLabel={option => option.label}
    />
  );
}
