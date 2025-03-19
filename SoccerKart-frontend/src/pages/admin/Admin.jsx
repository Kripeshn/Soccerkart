import React from 'react'
import AdminMenu from '../../Components/Layout/AdminMenu'
import { useAuth } from '../../context/auth'
import Nav from '../../Components/Layout/Nav'
import Footers from '../../Components/Layout/Footer/Footer'
const Admin = () => {
  const [auth] = useAuth();
  return (
    <div>
      <Nav/>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>Admin Name: {auth?.user?.name}</h3>
              <h3>Admin Email: {auth?.user?.email}</h3>
              
            </div>
          </div>
        </div>
      </div>
      <Footers />
    </div>
  )
}

export default Admin
