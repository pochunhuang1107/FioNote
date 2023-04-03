import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import SignupForm from '../../components/SignupForm';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const handleClick = () => {
        setIsLogin(!isLogin);
    }
    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-r from-cyan-500 to-blue-500 justify-center">

            {isLogin ? <LoginForm /> : <SignupForm onFormSubmit={(e) => setIsLogin(e)}/>}
            <div onClick={handleClick} className="cursor-pointer mt-3">
                {isLogin ? 
                <p className="text-sm font-semibold text-gray-200">Don't have an account? <span className="text-lg text-blue-600 hover:underline focus:text-blue-800">Sign Up here.</span></p> : 
                <p className="text-sm font-semibold text-gray-200">Already have an account? <span className="text-lg text-blue-600 hover:underline focus:text-blue-800">Login here.</span></p>}
            </div>
        </div>
    )
}
