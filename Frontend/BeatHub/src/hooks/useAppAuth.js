import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export const useAppAuth = () => {
    const { user, login, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return {
        user,
        login,
        handleLogout 
    };
};