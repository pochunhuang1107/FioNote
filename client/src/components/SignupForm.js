import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useCreateUserMutation, useLoginUserMutation } from '../store/apis/userApi';
import { AiOutlineLoading } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { setLogin } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import * as Yup from "yup";

const SignupForm = () => {
    const errorMessageClasses = classNames("text-red-600 text-sm");
    const inputClasses = classNames("px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200");

    const [createUser, results] = useCreateUserMutation();
    const [loginUser, loginResults] = useLoginUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const SignupSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name must be at least 2 characters.')
            .max(50, 'First name must be within 50 characters!').required('First name required'),
        lastName: Yup.string().min(2, 'Last name must be at least 2 characters.')
            .max(50, 'Last name must be within 50 characters!').required('Last name required'),
        email: Yup.string().email('Invalid email').required('Email required'),
        username: Yup.string().min(4, 'Username must be at least 4 characters.')
            .max(50, 'Username must be within 50 characters!')
            .matches(/^[a-zA-Z0-9@.]+$/, "Spaces and special character are not allowed")
            .required('Username required'),
        password: Yup.string().min(4, 'Password must be at least 4 characters.')
            .matches(/^[a-zA-Z0-9~!@#$%^&*()_+-=<>/"'{}]+$/, "Space is not allowed")
            .max(50, 'Password must be within 50 characters!').required('Password required'),
    });

    const initialValues = {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
    };

    const onSubmit = async (values) => {
        const response = await createUser(values);
        const data = await response.data;

        if (data) {
            const loginResponse = await loginUser(values);
            const loginData = await loginResponse.data;
            if (loginData) {
                dispatch(
                    setLogin({
                        _id: loginData.user._id,
                        token: loginData.token,
                        firstName: loginData.user.firstName,
                    })
                );
                navigate("/");
            }
        } else {
            alert(response.error.data);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={SignupSchema}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col w-4/5 lg:w-96" >
                    <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="firstName">First Name</label>
                        <Field className={inputClasses} type="text" name="firstName" />
                        <div className={errorMessageClasses}><ErrorMessage name="firstName" /></div>
                    </div>

                    <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="lastName">Last Name</label>
                        <Field className={inputClasses} type="text" name="lastName" />
                        <div className={errorMessageClasses}><ErrorMessage name="lastName" /></div>
                    </div>

                    <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="email">Email</label>
                        <Field className={inputClasses} type="email" name="email" />
                        <div className={errorMessageClasses}><ErrorMessage name="email" /></div>
                    </div>

                    <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="username">Username</label>
                        <Field className={inputClasses} type="text" name="username" />
                        <div className={errorMessageClasses}><ErrorMessage name="username" /></div>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="password">Password</label>
                        <Field className={inputClasses} type="password" name="password" />
                        <div className={errorMessageClasses}><ErrorMessage name="password" /></div>
                    </div>

                    <button className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-orange-500 rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-orange-500 focus:ring-4" type="submit" disabled={isSubmitting}>
                        {results.isLoading || loginResults.isLoading ? <AiOutlineLoading className='animate-spin w-full text-xl my-1' /> : "Sign Up"}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default SignupForm;
