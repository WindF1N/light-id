import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams, Link, useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'

import Buttons from '../Main/Buttons'
import Back from '../Main/Back'
import ProfileGrid from './ProfileGrid'
import ProfileVides from './ProfileVides'
import ProfileYouLIGHTS from './ProfileYouLIGHTS'
import ProfileAlbums from './ProfileAlbums'
import ContentButtons from './ContentButtons'

import Service from './../Service'
const service = new Service()

function Profile({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired, usersCount}) {

  const navigate = useNavigate();

  const { username } = useParams();
  const [user, setUser] = useState(null)
  const [sub, setSub] = useState(false)
  const [write, setWrite] = useState(false)

  const [posts, setPosts] = useState([])
  const [nextPage, setNextPage] = useState("/api/posts/user/"+username+"?page=1")
  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)
  const [firstPage, setFirstPage] = useState("/api/posts/user/"+username+"?page=1")

  useEffect(() => {
    if (access) {
      if (!user){
        service.getUserByUsername(username, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setUser(result.data.data);
            setRefreshRequired(false);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, user])

  useEffect(() => {
    if (access){
      if (!stop){
        if (loading){
          service.getPostsByURL(nextPage, {'Authorization': `Bearer ${access}`}).then(function (result) {
            if (result.status === 200){
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true)
              }
              setPosts([...posts, ...result.data.result]);
              setNextPage(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          });
        }
      }
    }
  }, [access, stop, loading])

  useEffect(() => {
    if (access){
      if (sub){
        service.subscribe(user.username, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setSub(false);
            setRefreshRequired(false);
            document.querySelector('#subs_count').innerHTML = result.data.count;
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, sub])

  useEffect(() => {
    if (access){
      if (write){
        service.goChat(user.username, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setWrite(false);
            setRefreshRequired(false);
            navigate('/messenger/inbox/' + result.data.result.id)
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, write])

  useEffect(() => {
    if (access){
      if (user){
        if (user.username.toLowerCase() !== username.toLowerCase()){
          setUser(null)
          setPosts([])
          setStop(false)
          setLoading(true)
          setNextPage("/api/posts/user/"+username+"?page=1")
          setFirstPage("/api/posts/user/"+username+"?page=1")
        }
      }
    }
  }, [access, user, username, posts, loading, stop])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, [])

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100){
      setLoading(true);
    }
  }

  const subscribe = (e) => {
    if (!sub){
      if (e.target.dataset.subs === "false"){
        e.target.innerHTML = 'Отписаться';
        e.target.dataset.subs = "true";
      }else if (e.target.dataset.subs === "true"){
        e.target.innerHTML = 'Подписаться';
        e.target.dataset.subs = "false";
      };
      setSub(true);
    }
  }

  const goChat = (e) => {
    if (!write){
      setWrite(true);
    }
  }

  const scrolltoPosts = (e) => {
    document.querySelector('.grid').scrollIntoView({ block: "center", behavior: "smooth" });
  }

  return (
      user?
        <>
          <div className="profile">
            <div className="profileHeader">
              <div>
                {user.username} {requestUser.username === user.username && <img src={require('../Main/images/arrow-down.svg').default} alt=""/>}
              </div>
              {requestUser ?
                requestUser.username === user.username ?
                  <div><Link to="/settings/main"><img src={require('../Main/images/settings.svg').default} alt=""/></Link></div>
                : <div><img src={require('../Main/images/more.svg').default} alt=""/></div>
              : null}
            </div>
            <div className="profileMain">
              <div className="storie">
                <div className="avatar">
                  <img src={user.avatar ? user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={user.name} />
                </div>
                <div className="info">
                  <div className="name">{user.name} {user.last_name}</div>
                  <div className="t">{user.category}</div>
                  <div className="t">{user.city}</div>
                  <div className="site"><a href={user.site} target="_blank">{user.site}</a></div>
                  <div className="reg">В LIGHTid с {user.date_joined}</div>
                </div>
              </div>
              <div className="stats">
                <div className="stat" onClick={scrolltoPosts}>
                  <div>{ user.posts_count }</div>
                  <div>Публикации</div>
                </div>
                <Link to={"/"+user.username+"/subscribers"}>
                <div className="stat">
                  <div id="subs_count">{ user.subscribers_count }</div>
                  <div>Подписчики</div>
                </div>
                </Link>
                <Link to={"/"+user.username+"/subscribes"}>
                <div className="stat">
                  <div>{ user.subscribes_count }</div>
                  <div>Подписки</div>
                </div>
                </Link>
                {usersCount ?
                  user.username === requestUser.username &&
                  <Link to="/search/all#profiles">
                  <div className="stat">
                    <div>{ usersCount }</div>
                    <div>С нами уже</div>
                  </div>
                  </Link>
                : null}

                {requestUser ?
                  <>
                  {requestUser.username === user.username ? null :
                    <div className="buttons">
                      {user.is_sub ?
                        <div className="button" onClick={subscribe} data-subs="true">Отписаться</div>
                      :
                        <div className="button" onClick={subscribe} data-subs="false">Подписаться</div>
                      }

                      <div className="button" onClick={goChat}>Написать</div>

                      {user.phone ?
                        <div className="button"><a href={"tel:"+user.phone}>Контакты</a></div>
                      : null}
                    </div>
                  }
                  </>
                : null}
              </div>
            </div>
            {user.bio ?
              <div className="bio" style={{whiteSpace: "pre-wrap"}}>
                {user.bio}
              </div>
            : null}
          </div>
          <ContentButtons />
          <Routes>
            <Route path="*" exact element={<ProfileGrid posts={posts}/>} />
            <Route path="/vides" exact element={<ProfileVides />} />
            <Route path="/youlights" exact element={<ProfileYouLIGHTS />} />
            <Route path="/albums" exact element={<ProfileAlbums />} />
          </Routes>
          <Buttons access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>
          {requestUser.username !== user.username && <Back />}
        </>
      : null
  );
}
export default Profile;
