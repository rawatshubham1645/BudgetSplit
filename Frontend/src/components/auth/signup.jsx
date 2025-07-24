import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema } from '@/schemas/validation';
import { USERS_REGISTER_REQUEST_OTP } from '@/imports/api';
import useMutation from '@/hooks/useMutation';
import { Mail, User, Phone, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const navigate = useNavigate();
  const { mutate, loading } = useMutation();

  useEffect(() => {
    document.querySelector('[data-first-name-input]')?.focus();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', mobileNumber: '', password: '', confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;
    const response = await mutate({ url: USERS_REGISTER_REQUEST_OTP, method: 'POST', data: payload });
    if (response.success) {
      navigate('/auth/verify', { state: payload });
    }
  };

  const inputClasses = `col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-2 pr-3 pl-10 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm sm:leading-6`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-teal-400 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-80 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <div className="mt-2 grid grid-cols-1">
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName')}
                  data-first-name-input
                  className={`${inputClasses} ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="John"
                />
                <User aria-hidden className="pointer-events-none ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4 col-start-1 row-start-1" />
              </div>
              {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <div className="mt-2 grid grid-cols-1">
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName')}
                  className={`${inputClasses} ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Doe"
                />
                <User aria-hidden className="pointer-events-none ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4 col-start-1 row-start-1" />
              </div>
              {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`${inputClasses} ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
              />
              <Mail aria-hidden className="pointer-events-none ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4 col-start-1 row-start-1" />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="mobileNumber"
                type="tel"
                autoComplete="tel"
                {...register('mobileNumber')}
                className={`${inputClasses} ${errors.mobileNumber ? 'border-red-500' : ''}`}
                placeholder="+91 9876543210"
              />
              <Phone aria-hidden className="pointer-events-none ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4 col-start-1 row-start-1" />
            </div>
            {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber.message}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className={`${inputClasses} ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <Lock aria-hidden className="pointer-events-none ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4 col-start-1 row-start-1" />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="mt-2 grid grid-cols-1">
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`${inputClasses} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <Lock aria-hidden className="pointer-events-none ml-3 size-5 self-center text-gray-400 dark:text-gray-300 sm:size-4 col-start-1 row-start-1" />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <Button loading={loading} type="submit" className="w-full py-3 font-semibold rounded-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
