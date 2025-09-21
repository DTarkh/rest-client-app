import Spinner from '@/src/shared/ui/spinner';
import dynamic from 'next/dynamic';

const VariablesPage = dynamic(
  () => import('@/src/pages-slice/variables-page').then(m => m.VariablesPage),
  {
    loading: () => <Spinner />,
  },
);

export default function Variables() {
  return <VariablesPage />;
}
