import { RequestBuilder } from '@/src/widgets/request-builder';
import { ResponseViewer } from '@/src/widgets/response-viewer';
import { useI18n } from '../model/i18n';
import { CodeGenerator } from '@/src/widgets/code-generator';

export function ClientPage() {
  const { t } = useI18n();

  return (
    <div className='p-4'>
      <div className='min-h-screen pt-20 md:pl-64'>
        <h1 className='text-gray-600 mt-2 mb-2'>{t('pageTitle')}</h1>

        <div className='flex flex-col gap-8 self-center sm:w-full'>
          <div>
            <RequestBuilder />
          </div>
          <div>
            <CodeGenerator />
          </div>
          <div>
            <ResponseViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
