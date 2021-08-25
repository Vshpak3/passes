// react
import { useMemo } from 'react';
import Link from 'next/link';
// third party
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// application
import { userAuthRegisterSchema } from '@domain/user/schema';
import Input from '@components/shared/Input';
import Layout from '@components/auth/Layout';

const ResetPasswordPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: yupResolver(userAuthRegisterSchema),
  });
  const onSubmit = useMemo(
    () =>
      handleSubmit(async (values) => {
        console.log({ values });
      }),
    []
  );
  return (
    <>
      <Layout title="Reset password">
        <form
          className="self-center pt-14 max-w-lg w-full mx-auto"
          onSubmit={onSubmit}
        >
          <h1 className="text-white text-center font-extrabold text-5xl mb-20">
            Reset your password
          </h1>
          <div className="flex flex-col max-w-sm w-full mx-auto">
            <Input
              {...register('password')}
              placeholder="Password"
              type="password"
              error={errors.password}
              autoComplete="current-password"
            />
            <Input
              {...register('confirmPassword')}
              placeholder="Confirm Password"
              type="password"
              error={errors.confirmPassword}
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="bg-button-default rounded-2xl px-4 py-3 text-normal text-white"
            >
              Save
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default ResetPasswordPage;
