import React, { useState, useEffect } from 'react'
import AdminMenu from '../../Components/Layout/AdminMenu'
import Nav from '../../Components/Layout/Nav'
import toastr from 'toastr';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CategoryForm from '../../Components/Form/CategoryForm';

import { Modal } from "antd";

const CreateCategory = () => {
  const  [categories, setCategories] = useState([])
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName,setUpdatedName] = useState("");


  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post("http://localhost:8080/api/v1/category/create-category", 
      { name }, 
    {
      headers: {
        "Authorization" : localStorage.getItem('authToken'),
      },
    });
      if (data?.success) {
        toastr.success(`${name} is created`);
        getAllCategory();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toastr.error("somthing went wrong in input form");
    }
  };

  const getAllCategory = async () => {
    try {
      const {data} = await axios.get('http://localhost:8080/api/v1/category/get-category');
      if(data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toastr.error("Error in getting all categories");
    }
  }
  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }, {
          headers: {
            "Authorization" : localStorage.getItem('authToken'),
          },
        }
      );
      if (data.success) {
        toastr.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      toastr.error("Something went wrong");
    }
  };
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/category/delete-category/${pId}`,
        {
          headers: {
              "Authorization": localStorage.getItem('authToken'), // Include the token in the Authorization header
          },
      }
      );
      if (data.success) {
        toastr.success(`Category is deleted`);

        getAllCategory();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      toastr.error("Something went wrong");
    }
  };
  return (
   <>
    <Nav />
     <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>          
          <div className="col-md-9 ps-5">          
              <h1  className='fw-normal fs-2'>Manage Category</h1> 
              <div className="p-3 w-50">
                <CategoryForm
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                />
                </div>   
              <div style={{paddingRight: '20px'}}>
                <table className="table" >
                  <thead>
                    <tr>
                      
                      <th scope="col">Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>                                                                                        
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                  </tbody>
                </table>
              </div>   
              <Modal onCancel={() => setVisible(false)} footer= {null} open={visible} >
              <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
              </Modal>     
          </div>
        </div>
      </div>
   </>
  )
}

export default CreateCategory
