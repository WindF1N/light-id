import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

function Header(){
  return (
    <div className="header">
      <div className="logo">
        <Link to="/">
          <img src={require('./images/Logo.svg').default} alt=""/>
        </Link>
      </div>
      <div>
        Мото-Четверг
      </div>
    </div>
  );
}
export default Header;
