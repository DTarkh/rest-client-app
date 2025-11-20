import { describe, it, expect } from 'vitest';

import * as SignIn from '@/features/sign-in';
import * as SignOut from '@/features/sign-out';
import * as Register from '@/features/register';
import * as CodeGen from '@/features/code-generation';
import * as HttpRequestFeature from '@/features/http-request';
import * as VariableManagement from '@/features/variable-management';

import * as EntityHttpRequest from '@/entities/http-request';
import * as EntityHttpResponse from '@/entities/http-response';
import * as EntityVariable from '@/entities/variable';
import * as EntityCodeSnippet from '@/entities/code-snippet';
import * as EntityI18n from '@/entities/i18n';

import * as WAppHeader from '@/widgets/app-header';
import * as WClientNavigation from '@/widgets/client-navigation';
import * as WCodeGenerator from '@/widgets/code-generator';
import * as WFooter from '@/widgets/footer';
import * as WLayouts from '@/widgets/layouts';
import * as WRequestBuilder from '@/widgets/request-builder';
import * as WResponseViewer from '@/widgets/response-viewer';
import * as WVariableManager from '@/widgets/variable-manager';

import * as PagesClient from '@/pages-slice/client-page';
import * as PagesHistory from '@/pages-slice/history-page';
import * as PagesHome from '@/pages-slice/home-page';
import * as PagesLogin from '@/pages-slice/login-page';
import * as PagesRegister from '@/pages-slice/register-page';
import * as PagesVariables from '@/pages-slice/variables-page';

import * as SharedConstants from '@/shared/constants';
import * as SharedRoutes from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

describe('barrel imports coverage', () => {
  it('all barrel modules load successfully', () => {
    const modules = [
      SignIn,
      SignOut,
      Register,
      CodeGen,
      HttpRequestFeature,
      VariableManagement,
      EntityHttpRequest,
      EntityHttpResponse,
      EntityVariable,
      EntityCodeSnippet,
      EntityI18n,
      WAppHeader,
      WClientNavigation,
      WCodeGenerator,
      WFooter,
      WLayouts,
      WRequestBuilder,
      WResponseViewer,
      WVariableManager,
      PagesClient,
      PagesHistory,
      PagesHome,
      PagesLogin,
      PagesRegister,
      PagesVariables,
      SharedConstants,
      SharedRoutes,
    ];
    modules.forEach(m => expect(m).toBeTruthy());
    expect(cn('a', 'b')).toBe('a b');
  });
});
