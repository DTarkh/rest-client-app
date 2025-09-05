'use client';
import { UiButton } from '../../../shared/ui/UiButton/UiButton';
import { useI18n } from '../i18n';

export function TFeatureButton({ className }: { className?: string }) {
  const { t } = useI18n();
  return <UiButton className={className}>{t('test-feature')}</UiButton>;
}
