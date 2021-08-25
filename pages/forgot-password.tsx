// react
import { useMemo } from 'react';
// third party
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// application
import { emailSchema } from '@domain/user/schema';
import Input from '@components/shared/Input';
import Layout from '@components/auth/Layout';

const ForgotPasswordPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>({
    resolver: yupResolver(emailSchema),
  });
  const onSubmit = useMemo(
    () =>
      handleSubmit(async (values) => {
        console.log({ values });
      }),
    []
  );
  return (
    <Layout title="Forgot password">
      <form
        className="self-center pt-14 max-w-md w-full mx-auto"
        onSubmit={onSubmit}
      >
        <h1 className="text-white text-center font-extrabold text-5xl mb-20">
          Forgot password
        </h1>
        <div className="flex flex-col mx-9">
          <Input
            {...register('email')}
            error={errors.email}
            placeholder="Email"
          />
          <button
            type="submit"
            className="bg-button-default rounded-2xl px-4 py-3 text-normal text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default ForgotPasswordPage;
