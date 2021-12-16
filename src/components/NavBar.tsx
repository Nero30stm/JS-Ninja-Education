import React from 'react';
import { Link } from 'react-router-dom';
import PillsList from "./PillsList";
function NavBar() {
    return (
        <div className='main-container'>
            <div>
                <Link to='/page-2'>adding pill</Link>
            </div>
            <PillsList />
        </div>
    );
};
export default NavBar;