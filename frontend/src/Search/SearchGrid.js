import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import Packery from 'packery'

import Buttons from '../Main/Buttons'
import Back from '../Main/Back'
import Service from './../Service'
const service = new Service()

function SearchGrid({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const navigate = useNavigate()

  const [content, setContent] = useState(window.location.hash ? window.location.hash.replace('#', '') : 'posts')

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)
  const [nextPage, setNextPage] = useState("/api/posts/?page=1")
  const [firstPage, setFirstPage] = useState("/api/posts/?page=1")

  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [stopProfiles, setStopProfiles] = useState(false)
  const [nextPageProfiles, setNextPageProfiles] = useState("/api/profiles/?page=1")
  const [firstPageProfiles, setFirstPageProfiles] = useState("/api/profiles/?page=1")

  const [sub, setSub] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
      if (!stop){
        if (loading){
          service.getPostsByURL(nextPage).then(function (result) {
            if (result.status === 200){
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true);
              }
              setPosts([...posts, ...result.data.result]);
              setNextPage(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          });
        }
      }
  }, [access, stop, loading])

  useEffect(() => {
      if (!stopProfiles){
        if (loadingProfiles){
          service.getPostsByURL(nextPageProfiles).then(function (result) {
            if (result.status === 200){
              setRefreshRequired(false);
              setLoadingProfiles(false);
              if (result.data.nextlink === firstPageProfiles){
                setStopProfiles(true)
              }
              setProfiles([...profiles, ...result.data.result]);
              setNextPageProfiles(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          });
        }
      }
  }, [access, stopProfiles, loadingProfiles])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, [stop, stopProfiles, content])

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100){
      if (!stop){
        if (content === 'posts'){
          setLoading(true);
        }
      }
      if (!stopProfiles){
        if (content === 'profiles'){
          setLoadingProfiles(true);
        }
      }
    }
  }

  useEffect(() => {
    if (content === 'posts'){
      var elem = document.querySelector('.grid');
      var pckry = new Packery( elem, {
        // options
        itemSelector: '.grid-item',
        gutter: 5
      });
    }
  })

  const submitHundler = (e) => {
    e.preventDefault();
    if (e.target[0].value) {
      navigate('/search/all/'+e.target[0].value);
      setNextPage("/api/search?search="+e.target[0].value+"&page=1");
      setFirstPage("/api/search?search="+e.target[0].value+"&page=1");
      setStop(false);
      setLoading(true);
      setPosts([]);
    }
  }

  const changeContent = (e) => {
    if (e.target.dataset.content === 'profiles'){
      e.target.parentElement.children[0].classList.remove('active');
      e.target.parentElement.children[1].classList.add('active');
    }else if (e.target.dataset.content === 'posts'){
      e.target.parentElement.children[1].classList.remove('active');
      e.target.parentElement.children[0].classList.add('active');
    }
    setContent(e.target.dataset.content);
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
      setUser(e.target.dataset.username);
    }
  }

  return (
    <>
      <div className="MainSearch">
        <form onSubmit={submitHundler}>
          <img src={require('../Main/images/search-input.svg').default} />
          <input type="text" name="search" placeholder="Поиск"/>
        </form>
      </div>
      <div className="searchButtons">
        <div className={content === 'posts' ? "searchButton active" : "searchButton"} onClick={changeContent} data-content="posts">
          Лучшее
        </div>
        <div className={content === 'profiles' ? "searchButton active" : "searchButton"} onClick={changeContent} data-content="profiles">
          Аккаунты
        </div>
      </div>
      {loading ?
      <div className="empty">Загрузка...</div>
      : null}
      {content === 'posts' ?
        <div className="grid">
          {posts?.map(c =>
            <>
            {c.items[0] ?
              <Link to={"/"+c.user.username+"/posts#post"+c.id} key={c.id}>
              <div className="grid-item">
                <img src={c.items[0].file} alt=""/>
                {c.items.length > 1 ?
                  <div className="icon">
                    <img src={require('../Main/images/profile-albums-active.svg').default} alt=""/>
                  </div>
                : null}
              </div>
              </Link>
            : null}
            </>
          )}
        </div>
      : null}
      {content === 'profiles' ?
        <div className="profiles-list">
          {profiles?.map(c =>
            <div className="profile">
              <Link to={"/"+c.username} key={c.username}>
              <div className="avatar">
                <img src={c.avatar ? c.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={c.name} />
              </div>
              <div className="info">
                <div className="username">
                  {c.username}
                </div>
                <div className="name">
                  {c.name}
                </div>
                <div className="name">
                  {c.subscribers_count} подписчиков
                </div>
              </div>
              </Link>
              {requestUser ?
                <div className="buttons">
                  {requestUser.username !== c.username ?
                    <>
                    {c.is_sub ?
                      <div className="button" onClick={subscribe} data-subs="true" data-username={c.username}>Отписаться</div>
                    :
                      <div className="button" onClick={subscribe} data-subs="false" data-username={c.username}>Подписаться</div>
                    }
                    </>
                  : null }
                </div>
              : null}
            </div>
          )}
        </div>
      : null}
      <Buttons access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>
      {window.location.hash && <Back />}
    </>
  );
}
export default SearchGrid;
