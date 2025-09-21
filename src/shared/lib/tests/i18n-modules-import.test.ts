import { describe, it, expect } from 'vitest';

// Импортируем множество i18n модулей чтобы покрыть строки деклараций
import * as editRequestI18n from '@/features/http-request/edit-request/model/i18n';
import * as registerI18n from '@/features/register/model/i18n';
import * as signInI18n from '@/features/sign-in/model/i18n';
import * as signOutI18n from '@/features/sign-out/model/i18n';
import * as requestBuilderI18n from '@/widgets/request-builder/model/i18n';
import * as codeGeneratorI18n from '@/widgets/code-generator/model/i18n';
import * as footerI18n from '@/widgets/footer/model/i18n';
import * as homePageI18n from '@/pages-slice/home-page/i18n';
import * as createVariableI18n from '@/features/variable-management/create-variable/model/i18n';

function nonEmpty(obj: unknown) {
  return !!obj && Object.keys(obj as Record<string, unknown>).length > 0;
}

describe('i18n modules import smoke', () => {
  it('all i18n objects are defined and non-empty', () => {
    expect(nonEmpty(editRequestI18n)).toBe(true);
    expect(nonEmpty(registerI18n)).toBe(true);
    expect(nonEmpty(signInI18n)).toBe(true);
    expect(nonEmpty(signOutI18n)).toBe(true);
    expect(nonEmpty(requestBuilderI18n)).toBe(true);
    expect(nonEmpty(codeGeneratorI18n)).toBe(true);
    expect(nonEmpty(footerI18n)).toBe(true);
    expect(nonEmpty(homePageI18n)).toBe(true);
    expect(nonEmpty(createVariableI18n)).toBe(true);
  });
});
