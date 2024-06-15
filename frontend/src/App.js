import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import InputMask from 'react-input-mask'

import Main from './Main/Main'
import PostComments from './Main/PostComments'
import Profile from './Profiles/Profile'
import ProfilePosts from './Profiles/ProfilePosts'
import SearchGrid from './Search/SearchGrid'
import ActiveSearch from './Search/ActiveSearch'
import ProfileSubscribes from './Profiles/ProfileSubscribes'
import ProfileSubscribers from './Profiles/ProfileSubscribers'
import Activity from './Activity/Activity'
import DeleteProfile from './Profiles/DeleteProfile'

import Settings from './Profiles/Settings'

import Chats from './Messenger/Chats'
import Chat from './Messenger/Chat'

import Crop from './Crop/Crop'
import './App.css';

import Service from './Service'
const service = new Service();

function App() {

  const [access, setAccess] = useState(localStorage.getItem('accessToken'))
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
  const [refreshRequired, setRefreshRequired] = useState(false)
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  const [posts, setPosts] = useState([])
  const [requestUser, setRequestUser] = useState()

  const [nextPage, setNextPage] = useState("/api/posts/?page=1")

  const [stop, setStop] = useState(false)
  const firstPage = "/api/posts/?page=1"

  const docHeight = document.documentElement.scrollHeight;

  const [phone, setPhone] = useState('+7 ')
  const [password, setPassword] = useState('')
  const [next, setNext] = useState(false)

  const [usersCount, setUsersCount] = useState(null)

  useEffect(() => {
    if (refreshRequired) {
      service.refreshTokens(refresh).then(function(result){
        if (result.status === 200){
          setAccess(result.data.access);
          localStorage.setItem('accessToken', result.data.access);
        }else if (result.status === 401 | result.status === 400){
          localStorage.removeItem('accessToken');
          setAccess(null);
          localStorage.removeItem('refreshToken');
          setRefresh(null);
        }
      });
    }
  }, [refreshRequired])

  useEffect(() => {
    if (access) {
      if (!requestUser){
        service.getUser({'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setRequestUser(result.data.data);
            setUsersCount(result.data.users_count);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, requestUser])

  const submitHundler = e => {
    e.preventDefault();
    setLoading(true);
    service.login({phone: phone, password: password}).then(function(result){
      if (result.status === 200){
        setLoading(false);
        setPassword('');
        setNext(false);
        setPhone('');
        localStorage.setItem('accessToken', result.data.access);
        setAccess(result.data.access);
        localStorage.setItem('refreshToken', result.data.refresh);
        setRefresh(result.data.refresh);
        setError(null);
      }else if (result.status === 401){
        if (result.data.detail === "No active account found with the given credentials"){
          setLoading(false);
          setNext(false);
          setPassword('');
          setPhone('');
          setError('Введенные вами телефон или пароль неккоректны.\nПроверьте номер телефона или пароль');
        }
      }
    })
  }

  const focusInput = (e) => {
    document.querySelector('.auth').style.overflowY = 'hidden';
    document.querySelector('.under-text').style.bottom = '20vh';
  }

  const blurInput = (e) => {
    document.querySelector('.under-text').style.bottom = '15px';
  }

  const changeInputPhone = (e) => {
    setPhone(e.target.value)
    if (e.target.value.length === 16){
      setTimeout(function(){
        setNext(true)
      }, 300)
    };
  }

  const changeInputPassword = (e) => {
    setPassword(e.target.value)
  }

  return (
    <>
      {access ?
        <BrowserRouter>
          {!requestUser?.active ?
            <Routes>
              <Route path="*" exact element={<Settings access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>}/>
            </Routes>
            :
            <Routes>
              <Route path="/" exact element={<Main access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired} posts={posts} setPosts={setPosts} nextPage={nextPage} setNextPage={setNextPage} stop={stop} setStop={setStop} firstPage={firstPage}/>} />
              <Route path="/p/:post_id/comments" exact element={<PostComments access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/:username/*" exact element={<Profile access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired} usersCount={usersCount}/>} />
              <Route path="/:username/posts" exact element={<ProfilePosts access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/:username/subscribes" exact element={<ProfileSubscribes access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/:username/subscribers" exact element={<ProfileSubscribers access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/search/all" exact element={<SearchGrid access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/search/all/:search" exact element={<ActiveSearch access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/messenger/inbox" exact element={<Chats access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/messenger/inbox/:id" exact element={<Chat access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/activity/all" exact element={<Activity access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/settings/main" exact element={<Settings access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>} />
              <Route path="/settings/delete/profile" exact element={<DeleteProfile/>} />
            </Routes>
          }
        </BrowserRouter>
      :
        <div className="auth" style={{height: window.innerHeight}}>
          <div className="form">
            <div className="logo-text">Welcome to the World of</div>
            <div className="logo">
              <img src={require('./Main/images/Logo.svg').default} alt="" />
            </div>
            <form>
              {next &&
                <><input type="password" name="password" value={password} autoFocus={true} onFocus={focusInput} onBlur={blurInput} onChange={changeInputPassword}/><div>Пароль</div>{loading ? <img src={require('./Main/images/loading.gif')} alt="loading" width="25px"/> : < img src={require("./Main/images/auth.svg").default} alt="" onClick={submitHundler}/> }</> }
              {!next &&
                <><InputMask maskPlaceholder="" mask="+7 999 999 99-99" type="tel" name="phone" value={phone} autoFocus={true} onFocus={focusInput} onBlur={blurInput} onChange={changeInputPhone}/><div>Номер телефона</div></>}

            </form>
            {error? <div className="error" style={{whiteSpace: "pre-wrap"}}>{error}</div> : null}
            <div className="under-text">Продолжая использовать приложение, вы соглашаетесь<br/>с <a href="#">Пользовательским соглашеним</a> LIGHT id</div>
          </div>
        </div>
      }
    </>
  );
}

export default App;
