import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
  return (
   <>
   <div className='text-center'>
    <h1 className='fw-normal'>Admin Panel</h1>
    
  <div className="list-group">
  <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action" aria-current="true">
    Create Category
  </NavLink>
  <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
    Create Product
  </NavLink>
  <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
    Products
  </NavLink>
  <NavLink to="/dashboard/admin/manage-user" className="list-group-item list-group-item-action">
    Manage User
  </NavLink>
  
   </div>
</div>
   </>
  )
}

export default AdminMenu
