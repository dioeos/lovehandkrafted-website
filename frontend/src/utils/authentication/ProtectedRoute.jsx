import {Outlet, Navigate} from 'react-router-dom';
import { useAuth } from './AuthProvider';

import Loader from '../../components/Loader/Loader';
import Unauthorized from '../../pages/Unauthorized/Unauthorized';


const ProtectedRoute = ({ vendorOnly = false}) => {
    const { isAuthorized, isVendor, isLoading} = useAuth()

    if (isLoading) {
        return <Loader />
    }

    if (!isAuthorized) {
        return <Navigate to="/account/login" replace />;
    }

    if (vendorOnly && !isVendor) {
        return <Unauthorized /> 
    }

    return <Outlet />;

}

export default ProtectedRoute;