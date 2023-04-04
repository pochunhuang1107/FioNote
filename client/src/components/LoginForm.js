import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useLoginUserMutation } from '../store/apis/userApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../store/slices/authSlice';
import { AiOutlineLoading } from 'react-icons/ai';

const LoginForm = () => {
    const [loginUser, results] = useLoginUserMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        username: '',
        password: ''
    };

    const onSubmit = async (values) => {
        const response = await loginUser(values);
        const data = await response.data;
        if (data) {
            dispatch(
                setLogin({
                    _id: data.user._id,
                    token: data.token,
                    firstName: data.user.firstName,
                })
            );
            navigate("/home");
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col w-4/5 lg:w-96">
                    <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="username">Username</label>
                        <Field className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" type="text" name="username" />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label className="text-sm font-semibold text-gray-200" htmlFor="password">Password</label>
                        <Field className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" type="password" name="password" />
                    </div>

                    <button className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-orange-500 rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-orange-500 focus:ring-4" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <AiOutlineLoading className='animate-spin w-full text-xl my-1' /> : "Log In"}
                    </button>
                    <div className='text-red-600 text-center'>{results.isError ? "Invalid credentials." : ""}</div>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
