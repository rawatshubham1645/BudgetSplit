import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/schemas/validation';
import { USERS_LOGIN } from '@/imports/api';
import useMutation from '@/hooks/useMutation';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/redux/features/user/userSlice';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate, loading } = useMutation();

  useEffect(() => {
    document.querySelector('[data-email-input]')?.focus();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    const response = await mutate({ url: USERS_LOGIN, method: 'POST', data });
    if (response.success) {
      dispatch(setUser(response.data.data.userDto));
      dispatch(setToken({ token: response.data.data.token }));
      navigate('/home');
    }
  };

  // Shared input styling
  const inputClasses = `col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-2 pr-3 pl-10 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm sm:leading-6`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-teal-400 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80 p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Sign in to your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                data-email-input
                className={`${inputClasses} ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
              />
              <Mail aria-hidden className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={`${inputClasses} ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <Lock aria-hidden className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4" />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <Link to="/auth/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button loading={loading} type="submit" className="w-full py-3 font-semibold rounded-lg">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link to="/auth/register" className="font-medium text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}