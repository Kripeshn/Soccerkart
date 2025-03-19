import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios';
import search from '../../assets/search.svg'
import { useNavigate } from 'react-router-dom';


const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const handleSubmit  = async(e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(
                `http://localhost:8080/api/v1/product/search/${values.keyword}`
              );
              setValues({ ...values, results: data });
              navigate("/search");
        } catch (error) {
            console.log(error);

        }
    }
  return (
    <div>
      <form className='d-flex' onSubmit={handleSubmit}>
        <input 
            type="search" 
            className='form-control me-2'
            placeholder='Search your products..'
            value={values.keyword}
            onChange={(e) => setValues({...values, keyword: e.target.value })}
        />
         <img  src={search} alt="" onClick={handleSubmit} />
      </form>
    </div>
  )
}

export default SearchInput
