import React, { useEffect, useState } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import isAdmin from '../../utils/isAdmin';

const Sidebar = () => {

    const [admin, setAdmin] = useState();
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const history = useHistory();

    useEffect(()=>{
        isAdmin(getAccessTokenSilently).then((res)=>setAdmin(res)).catch(()=>setAdmin(false));
        if(!isAuthenticated && admin===false){
            history.replace("/");
            alert("You dont have the necesary permissions");
            return;
        }
    },[admin]);

    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3 sidebar-sticky">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" aria-current="page" to={'/Dashboard/'}>
                            <i className="me-2 fa-solid fa-table-columns"></i>
                            Dashboard
                        </NavLink>
                    </li>
                    
                </ul>

                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
                    <span>Admin </span>
                    <a className="link-secondary" href="#" aria-label="Add a new report">
                        <span data-feather="plus-circle" className="align-text-bottom"></span>
                    </a>
                </h6>
                <ul className="nav flex-column mb-2">
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to={'/Dashboard/Products'}>
                            <i className="me-2 fa-solid fa-store"></i>
                            Products
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to={'/Dashboard/Orders'}>
                            <i className="me-2 fa-solid fa-receipt"></i>
                            Orders
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'/Dashboard/Users'}>
                            <i className="me-2 fa-solid fa-users"></i>
                            Users
                        </Link>
                    </li>

                    
                </ul>
            </div>
        </nav>
    )
}

export default Sidebar;