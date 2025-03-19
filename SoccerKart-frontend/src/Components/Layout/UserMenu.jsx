import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const UserMenu = () => {
  const [auth, setAuth] = useAuth();
  return (
        <>
        <div className='text-center'>
       <div className="list-group">
       <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action" aria-current="true">
         Profile
       </NavLink>
       <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">
         Orders
       </NavLink>
       
       
        </div>
     </div>
        </>
       
  )
}

export default UserMenu
