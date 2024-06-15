import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

function Back() {

  const navigate = useNavigate()

  return (
    <>
      <div className="main button item back" onClick={() => navigate(-1)}>
        <img src={require('./images/back-new.svg').default} alt=""/>
      </div>
    </>
  );
}
export default Back;
