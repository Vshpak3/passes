// third party
import { object, string, SchemaOf, ref } from 'yup';
// application
import { IAuthSingIn, IAuthRegister } from './index';

const validateEmail = string()
  .required('Email is required')
  .email('Email is invalid');

const validatePassword = string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required');

export const emailSchema: SchemaOf<{ email: string }> = object({
  email: validateEmail.defined(),
}).defined();

export const passwordSchema: SchemaOf<{ password: string }> = object({
  password: validatePassword.defined(),
}).defined();

export const userAuthSchema: SchemaOf<IAuthSingIn> = object({
  email: validateEmail.defined(),
  password: validatePassword.defined(),
}).defined();

export const userResetPasswordSchema: SchemaOf<{
  password: string;
  confirmPassword: string;
}> = object({
  password: validatePassword.defined(),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .defined(),
});

export const userAuthRegisterSchema: SchemaOf<IAuthRegister> = object({
  email: validateEmail.defined(),
  password: validatePassword.defined(),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .defined(),
}).defined();

export const userVerifySchema: SchemaOf<{ code: string }> = object({
  code: string().required('The code is required'),
});
