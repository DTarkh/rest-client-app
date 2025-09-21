import { RequestBuilder } from '@/widgets/request-builder';
import { ResponseViewer } from '@/widgets/response-viewer';
import { useI18n } from '../model/i18n';
import { CodeGenerator } from '@/widgets/code-generator';

export function ClientPage() {
  const { t } = useI18n();

  return (
    <div className='p-8'>
      <div className='min-h-screen pt-20 md:pl-64'>
        <h1 className='text-gray-600 mt-2 mb-2'>{t('pageTitle')}</h1>

        <div className='flex flex-col gap-8 self-center sm:w-full'>
          <div>
            <RequestBuilder />
          </div>
          <div>
            <CodeGenerator />
          </div>
          <div className='pb-30 sm:pb-20'>
            <ResponseViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
