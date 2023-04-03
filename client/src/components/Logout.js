import { useDispatch } from "react-redux"
import { setLogout } from "../store/slices/authSlice"
import classNames from "classnames";

export default function Logout() {
    const logoutClasses = classNames("font-semibold text-white text-lg px-10 py-2 rounded-lg bg-violet-400 hover:bg-violet-600 active:bg-violet-700 focus:outline-none");
    const dispatch = useDispatch();
    const handleLogoutClick = () => {
        dispatch(setLogout());
    }
    return (
        <button className={logoutClasses} onClick={handleLogoutClick}>
            Log Out
        </button>
    )
}
