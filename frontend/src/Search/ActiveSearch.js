import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'

import Buttons from '../Main/Buttons'
import Back from '../Main/Back'
import Service from './../Service'
import Posts from './Posts'
import Profiles from './Profiles'
const service = new Service()

function ActiveSearch({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const navigate = useNavigate()
  const { search } = useParams()
  const [content, setContent] = useState('posts')

  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [stopPosts, setStopPosts] = useState(false)
  const [nextPagePosts, setNextPagePosts] = useState("/api/posts/search?search="+search+"&page=1")
  const [firstPagePosts, setFirstPagePosts] = useState("/api/posts/search?search="+search+"&page=1")

  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [stopProfiles, setStopProfiles] = useState(false)
  const [nextPageProfiles, setNextPageProfiles] = useState("/api/profiles/search?search="+search+"&page=1")
  const [firstPageProfiles, setFirstPageProfiles] = useState("/api/profiles/search?search="+search+"&page=1")

  useEffect(() => {
    if (access){
      if (!stopPosts){
        if (loadingPosts){
          service.getPostsByURL(nextPagePosts, {'Authorization': `Bearer ${access}`}).then(function (result) {
            if (result.status === 200){
              setRefreshRequired(false);
              setLoadingPosts(false);
              if (result.data.nextlink === firstPagePosts){
                setStopPosts(true)
              }
              setPosts([...posts, ...result.data.result]);
              setNextPagePosts(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          });
        }
      }
    }
  }, [access, stopPosts, loadingPosts])

  useEffect(() => {
    if (access){
      if (!stopProfiles){
        if (loadingProfiles){
          service.getPostsByURL(nextPageProfiles, {'Authorization': `Bearer ${access}`}).then(function (result) {
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
    }
  }, [access, stopProfiles, loadingProfiles])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, [])

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100){
      if (content === 'posts'){
        setLoadingPosts(true);
      }else if(content === 'profiles'){
        setLoadingProfiles(true);
      }
    }
  }

  useEffect(() => {
    document.querySelector('input[name="search"]').value = search;
  })

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

  const submitHundler = (e) => {
    e.preventDefault();
    if (e.target[0].value) {
      navigate('/search/all/'+e.target[0].value, {replace: true});

      setNextPagePosts("/api/posts/search?search="+e.target[0].value+"&page=1");
      setFirstPagePosts("/api/posts/search?search="+e.target[0].value+"&page=1");
      setStopPosts(false);
      setLoadingPosts(true);
      setPosts([]);

      setNextPageProfiles("/api/profiles/search?search="+e.target[0].value+"&page=1");
      setFirstPageProfiles("/api/profiles/search?search="+e.target[0].value+"&page=1");
      setStopProfiles(false);
      setLoadingProfiles(true);
      setProfiles([]);
    }
  }

  return (
    <>
      <div className="MainSearch">
        <form onSubmit={submitHundler}>
          <img src={require('../Main/images/search-input.svg').default} />
          <input type="text" name="search" placeholder="Поиск" />
        </form>
      </div>
      {posts.length > 0 && profiles.length > 0 &&
      <div className="searchButtons">
        <div className="searchButton active" onClick={changeContent} data-content="posts">
          Лучшее
        </div>
        <div className="searchButton" onClick={changeContent} data-content="profiles">
          Аккаунты
        </div>
      </div>
      }
      {posts.length > 0 && profiles.length > 0 ?
        <>
          {content === 'posts' ?
            <Posts posts={posts} search={search} loading={loadingPosts}/>
          : null}
          {content === 'profiles' ?
            <Profiles profiles={profiles} search={search} loading={loadingProfiles} requestUser={requestUser}/>
          : null}
        </>
      :
        <>
        {posts.length > 0 ?
          <Posts posts={posts} search={search} loading={loadingPosts}/>
        : null}
        {profiles.length > 0 ?
          <Profiles profiles={profiles} search={search} loading={loadingProfiles} requestUser={requestUser}/>
        : null}
        </>
      }

      <Buttons access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>
      <Back/>
    </>
  );
}
export default ActiveSearch;
