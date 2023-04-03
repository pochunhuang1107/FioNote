import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import { useSelector } from 'react-redux';

export default function App() {
    const auth = useSelector(state => state.auth);
    const isAuth = auth.token;
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={isAuth ? <HomePage /> : <LoginPage />} />
                <Route path='/*' element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}
