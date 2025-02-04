import React from 'react';
import { Outlet} from "react-router-dom";
import Header from './Header';
import '../redirect_portal/redirect_style.css';

function Layout({userThem,handleClickUser}) {
 // alert(userColorTheme)
  return (
    <div 
   // id='admin2'
     className={`App ${userThem} `} id='admin1'>
    <Header userThem={userThem} handleClickUser={handleClickUser}/>
    <Outlet/>
  </div>
  )
};

export default Layout;