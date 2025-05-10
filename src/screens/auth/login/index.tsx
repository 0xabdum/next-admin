import { CircleX } from 'lucide-react';
import { LoginForm } from './_components/login-form';

export default function LoginScreen() {
  return (
    <div className='flex h-dvh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <a href='#' className='flex items-center gap-2 self-center font-medium'>
          <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
            <CircleX className='size-4' />
          </div>
          0xabdum.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
