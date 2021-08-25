// React
import { useMemo } from 'react';
// next
import Link from 'next/link';
// third party
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useQuery } from '@apollo/client';
// application
import Input from '@components/shared/Input';
import { IAuthSingIn } from '@domain/user';
import { userAuthSchema } from '@domain/user/schema';
import Layout from '@components/auth/Layout';
import { useAuthLogin } from '@state/Auth/AuthHooks';
// import { User } from '@domain/user';
// import { GET_USERS_LIST } from '@domain/user/graphql';
// import { GetUserVars } from '@domain/user/interfaces';

const LoginPage = (props) => {
  console.log({ props });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IAuthSingIn>({
    resolver: yupResolver(userAuthSchema),
  });
  const onLogin = useAuthLogin();
  const submit = useMemo(
    () =>
      handleSubmit(async (values) => {
        await onLogin(values);
      }),
    [handleSubmit]
  );
  // const { loading, error, data } = useQuery<User[], GetUserVars>(
  //   GET_USERS_LIST,
  //   { variables: { limit: 10 } }
  // );

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(</p>;
  // console.log({ data });

  return (
    <Layout title="Login">
      <form
        className="self-center pt-14 max-w-sm w-full mx-auto"
        onSubmit={submit}
      >
        <h1 className="text-white text-center font-extrabold text-5xl mb-20">
          Login page
        </h1>
        <div className="flex flex-col mx-2">
          <Input
            {...register('email')}
            id="input-email"
            placeholder="Email"
            error={errors.email}
          />
          <Input
            {...register('password')}
            type="password"
            id="input-password"
            autoComplete="current-password"
            placeholder="Password"
            error={errors.password}
            classWrapper="mb-3"
          />
          <div className="self-end mb-10">
            <Link replace href="/forgot-password">
              <a href="/forgot-password" className="text-white text-sm">
                Forgot password?
              </a>
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-button-default rounded-2xl px-4 py-3 text-normal text-white"
          >
            {isSubmitting ? 'Processing...' : 'Login'}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default LoginPage;

// export async function getStaticsProps() {
//   const data = await client.query({
//     query: gql`
//       query GetRates {
//         rates(currency: "USD") {
//           currency
//         }
//       }
//     `,
//   });

//   return {
//     props: data,
//   };
// }
