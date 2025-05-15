import { LoaderCircle } from 'lucide-react';

export default function Spinner() {
  return (
    <div className='animate-spin'>
      <LoaderCircle size={32} />
    </div>
  );
}
