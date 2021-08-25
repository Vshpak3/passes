import { useMemo } from 'react';
// next
import Link from 'next/link';
// third party
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// application
import { userAuthRegisterSchema } from '@domain/user/schema';
import { IAuthRegister } from '@domain/user';
import Input from '@components/shared/Input';
import Layout from '@components/auth/Layout';

const RegisterPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IAuthRegister>({
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
    <Layout title="Register">
      <form
        className="self-center pt-14 max-w-sm w-full mx-auto"
        onSubmit={onSubmit}
      >
        <h1 className="text-white text-center font-extrabold text-5xl mb-20">
          Sign Up
        </h1>
        <div className="flex flex-col mx-2">
          <Input
            {...register('email')}
            placeholder="Email"
            error={errors.email}
          />
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
            Login
          </button>
          <div className="mt-9">
            <p className="flex items-center justify-center text-white font-normal">
              Already have an account?&nbsp;
              <Link href="/login">
                <a href="/login" className="font-bold">
                  Log in
                </a>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default RegisterPage;
