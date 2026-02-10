import * as yup from 'yup';

const checkEmailExists = async (email: string) => {
    const existingEmails = ['exists@gmail.com', 'user@example.com'];
    return existingEmails.includes(email.toLowerCase());
};

export const loginSchema = yup.object({
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .test('email-api-check', 'Invalid email', async (value, context) => {
            if (!value) return true;
            const existsInApi = await checkEmailExists(value);

            if (existsInApi) {
                return context.createError({ message: 'Please use the sign up option instead' });
            }

            if (value.toLowerCase().endsWith('@gmail.com')) {
                return context.createError({
                    message: "Looks like you're using a Gmail -- sign up with Google to continue."
                });
            }

            return true;
        }),
    password: yup.string().required("enter_password"),
});

export type LoginFormSchema = yup.InferType<typeof loginSchema>;
