import React from 'react';

const SearchBarProducts = (props) => {



    return (
        <>

            <div className="row">
                <div className="col-3 text-center">
                    <label className="form-check-label fw-semibold" htmlFor="sortByPrice">
                        Sort By Price
                    </label>
                    {/* <select onChange={(e) => { props.setSortOrder(e.target.value) }} className="p-1 border-0 w-auto fw-semibold text-white bg-danger" id='sortByPrice' aria-label="Default select example">
                        <option className='fw-semibold text-white bg-danger' value={undefined}></option>
                        <option className='fw-semibold text-white bg-danger' value="ASC">ASC</option>
                        <option className='fw-semibold text-white bg-danger' value="DESC">DESC</option>
                    </select> */}
                    
                    {props.sort === 'ASC' ? <button className='p-1 border-0 ms-2 bg-danger text-white rounded' onClick={ () => {props.setSortOrder('DESC')} }>   <i className="mx-2 fa-solid fa-arrow-up-short-wide"></i> </button> :
                    <button className='p-1 border-0 ms-2 bg-danger text-white rounded' onClick={ () => {props.setSortOrder('ASC')} }>  <i className="mx-2 fa-solid fa-arrow-up-wide-short"></i> </button> }

                </div>
                <div className="col-7 text-center">

                    <div className="input-group mx-auto" role="search">
                        <input className="form-control me-0 bg-light" type="search" onChange={(e) => props.setSearch(e.target.value)} placeholder="Search a product" aria-label="Search" />
                    </div>

                </div>
                <div className="col-2 text-center">
                    <span className="text-center me-3 ">Show</span>
                    <select defaultValue={8} onChange={(e) => { props.setPage(e.target.value) }} className="p-1 border-0 w-auto fw-semibold text-white border-0 ms-1 bg-danger text-white rounded" id='page' aria-label="Default select example">
                        <option className='fw-semibold text-white bg-danger' value={4}>4</option>
                        <option className='fw-semibold text-white bg-danger' value={8}>8</option>
                        <option className='fw-semibold text-white bg-danger' value={12}>12</option>
                    </select>

                </div>

            </div>
        </>
    )


}


export default SearchBarProducts;