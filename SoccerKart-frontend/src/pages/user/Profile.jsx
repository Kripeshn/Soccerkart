import React from 'react'
import UserMenu from '../../Components/Layout/UserMenu'
import Nav from '../../Components/Layout/Nav'
import { Footer } from 'antd/es/layout/layout'
import Footers from '../../Components/Layout/Footer/Footer'

const Profile = () => {
  return (
    <div>
        <Nav />
    <div className="container-fluid m-3 p-3">
      <div className="row">
          <div className="col-md-3">
              <UserMenu />
          </div>
          <div className="col-md-9">
              <h1>Your Profile</h1>
          </div>
      </div>
    </div>
   
  </div>
  )
}

export default Profile
