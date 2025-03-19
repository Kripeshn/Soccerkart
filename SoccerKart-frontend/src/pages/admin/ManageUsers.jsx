import React from 'react'
import AdminMenu from '../../Components/Layout/AdminMenu'
import Nav from '../../Components/Layout/Nav'


const ManageUsers = () => {
  return (
    <>
    <Nav />
     <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">          
              <h1>All Users</h1>                  
          </div>
        </div>
      </div>
   </>
  )
}

export default ManageUsers
