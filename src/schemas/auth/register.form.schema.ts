import * as yup from 'yup';

const checkEmailExists = async (email: string) => {
    const existingEmails = ['exists@gmail.com', 'user@example.com'];
    return existingEmails.includes(email.toLowerCase());
};

export const registerSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .test('email-api-check', 'Invalid email', async (value, context) => {
            if (!value) return true;
            const existsInApi = await checkEmailExists(value);

            if (existsInApi) {
                return context.createError({ message: 'This email already exists, You can continue with login process' });
            }

            if (value.toLowerCase().endsWith('@gmail.com')) {
                return context.createError({
                    message: "Looks like you're using a Gmail -- sign up with Google to continue."
                });
            }

            return true;
        }),
    password: yup.string()
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/,
            'Password must meet security requirements'
        ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

export type RegisterFormSchema = yup.InferType<typeof registerSchema>;
