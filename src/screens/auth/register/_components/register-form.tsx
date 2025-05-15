'use client';
import { cn } from '@/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { CreateUserSchema } from '@/schema/user-schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormMessagePassword,
  FormMessagePasswordItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import slugify from 'react-slugify';

type FormData = z.infer<typeof CreateUserSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [loading, startTransition] = useTransition();
  const [showPassword, setShow] = useState([false, false]);
  const [showPw, ShowConfirmPw] = showPassword;
  const [focusPassword, setFocus] = useState([false, false]);
  const [focusPw, focusConfirmPw] = focusPassword;
  const [passValid, setPassValid] = useState({
    password: {
      len: false,
      low: false,
      cap: false,
      num: false,
    },
    retype_password: {
      same: false,
      len: false,
      low: false,
      cap: false,
      num: false,
    },
  });
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
    console.log(values);
    const body = values;
    body.username =
      slugify(body.firstName + ' ' + body.lastName, { delimiter: '_' }) +
      Math.floor(Math.random() * 100);
    // console.log(body);
    startTransition(async () => {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      console.log(result);
    });
  }

  const handleKeyUp = async (fieldName: keyof FormData) => {
    await form.trigger(fieldName);

    // const isValid = await form.trigger();
    // const formValues = form.getValues();

    if (['password', 'confirmPassword'].includes(fieldName)) {
      const pwdLength = /^.{8,50}$/;
      const pwdUpper = /[A-Z]+/;
      const pwdLower = /[a-z]+/;
      const pwdNumber = /[0-9]+/;
      const pwdSpecial = /[!@#$%^&()'[\]"?+-/*={}.,;:_]+/;

      const password = form.getValues(fieldName)?.toString() || '';
      setPassValid((prev) => ({
        ...prev,
        [fieldName]: {
          len: pwdLength.test(password),
          low: pwdLower.test(password),
          cap: pwdUpper.test(password),
          num: pwdNumber.test(password) && pwdSpecial.test(password),
          ...(fieldName === 'confirmPassword'
            ? { same: password === form.getValues('password') }
            : {}),
        },
      }));
    }
    // console.log(_.isEqual(formValues, form.getValues()));
    // const oldValues = JSON.stringify({
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   email: user.email,
    //   phone_number: user.phone_number.replace('0', ''),
    //   password: !user.is_password_set ? '' : undefined,
    //   retype_password: !user.is_password_set ? '' : undefined,
    //   is_password_set: user.is_password_set,
    // });
    // setDisabled(isValid);
  };
  // console.log(form.getFieldState('password').invalid);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome</CardTitle>
          <CardDescription>Register yout Account</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your first name'
                        {...field}
                        onKeyUp={() => handleKeyUp('firstName')}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your last name'
                        {...field}
                        onKeyUp={() => handleKeyUp('lastName')}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your email'
                        {...field}
                        onKeyUp={() => handleKeyUp('email')}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative' aria-invalid={true}>
                        <Input
                          type={showPw ? 'text' : 'password'}
                          placeholder='Enter your password'
                          {...field}
                          aria-invalid={fieldState.invalid ? 'true' : 'false'}
                          onKeyUp={() => handleKeyUp('password')}
                          onFocus={() => setFocus([true, focusConfirmPw])}
                          onBlur={() => setFocus([false, focusConfirmPw])}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7'
                          onClick={() =>
                            setShow(() => [!showPw, ShowConfirmPw])
                          }
                        >
                          {showPw ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                          <span className='sr-only'>
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    {focusPw && (
                      <FormMessagePassword className='w-full'>
                        <FormMessagePasswordItem
                          isValid={passValid.password.len}
                          message='Min. 8 characters, and Max. 50 characters'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.password.low}
                          message='At least one lowercase letter'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.password.cap}
                          message='At least one uppercase letter'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.password.num}
                          message='Must include numbers, punctuation, or symbols'
                        />
                      </FormMessagePassword>
                    )}
                    {/* <FormMessage className='text-xs' /> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={ShowConfirmPw ? 'text' : 'password'}
                          placeholder='Confirm your password'
                          {...field}
                          aria-invalid={fieldState.invalid ? 'true' : 'false'}
                          onKeyUp={() => handleKeyUp('confirmPassword')}
                          onFocus={() => setFocus([focusPw, true])}
                          onBlur={() => setFocus([focusPw, false])}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7'
                          onClick={() =>
                            setShow(() => [showPw, !ShowConfirmPw])
                          }
                          onFocus={() =>
                            setFocus(() => [focusPw, !focusConfirmPw])
                          }
                        >
                          {showPw ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                          <span className='sr-only'>
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    {/* <FormMessage className='text-xs' /> */}
                    {focusConfirmPw && (
                      <FormMessagePassword className='w-full'>
                        <FormMessagePasswordItem
                          isValid={passValid.retype_password.same}
                          message='Password and confirm password do not match'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.retype_password.len}
                          message='Min. 8 characters, and Max. 50 characters'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.retype_password.low}
                          message='At least one lowercase letter'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.retype_password.cap}
                          message='At least one uppercase letter'
                        />
                        <FormMessagePasswordItem
                          isValid={passValid.retype_password.num}
                          message='Must include numbers, punctuation, or symbols'
                        />
                      </FormMessagePassword>
                    )}
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Submit
              </Button>
            </form>
          </Form>
          <div className='text-center text-sm'>
            You have an account?{' '}
            <Link href='/login' className='underline underline-offset-4'>
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  '>
        By clicking Register, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
