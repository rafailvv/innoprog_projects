import { Button } from '@mui/material';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { useContext } from 'react';

const PrivateRoute = (): JSX.Element => {
  const navigator = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const {store} = useContext(Context);
  return isLoggedIn ?
    <>
      <Button onClick={async () => {await store.logout(); navigator('/login');}}> LogOut</Button>
      <Outlet />
    </>
    : <Navigate to="/login" />; 
};

export default PrivateRoute;