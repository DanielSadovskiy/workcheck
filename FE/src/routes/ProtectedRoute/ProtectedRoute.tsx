import { Navigate, Outlet } from "react-router-dom";

interface IProtectedRoute {
    permissions: string[];
    redirectPath?: string;
    children?: React.ReactNode;
}

export const ProtectedRoute = ({
    permissions,
    redirectPath = '/dashboard',
    children,
  }: IProtectedRoute) => {
    const user =  JSON.parse(localStorage.getItem('user') as string) || undefined;

    let isAllowed = false;
    
    if(permissions.includes('passwordChanged')) {
        if(user && user.passwordIsChanged) {
            isAllowed = true;
        }
    }

    if(permissions.includes('user') && user) {
        isAllowed = true
    }


    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children ? <>{children}</> : <Outlet />;
  };