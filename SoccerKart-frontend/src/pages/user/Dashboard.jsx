import React from 'react'
import Nav from '../../Components//Layout/Nav'
import UserMenu from '../../Components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import Footers from '../../Components/Layout/Footer/Footer'

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <div>
        <Nav />
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{auth?.user?.name}</h3>
              <h3>{auth?.user?.email}</h3>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard
