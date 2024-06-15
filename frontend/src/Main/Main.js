import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import Header from './Header'
import Stories from './Stories'
import Services from './Services'
import Vides from './Vides'
import YouLIGHT from './YouLIGHT'
import Posts from './Posts'
import Buttons from './Buttons'

function Main({access, setAccess, refresh, setRefresh, requestUser, setRequestUser, setRefreshRequired, posts, setPosts, nextPage, setNextPage, stop, setStop, firstPage}) {
  return (
    <>
      <Header />
      <Stories />
      <Services />
      <Vides />
      <YouLIGHT />
      <Posts access={access}
             setAccess={setAccess}
             refresh={refresh}
             setRefresh={setRefresh}
             requestUser={requestUser}
             setRequestUser={setRequestUser}
             setRefreshRequired={setRefreshRequired}
             posts={posts}
             setPosts={setPosts}
             nextPage={nextPage}
             setNextPage={setNextPage}
             stop={stop}
             setStop={setStop}
             firstPage={firstPage}
             />
      <Buttons access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>
    </>
  );
}
export default Main;
