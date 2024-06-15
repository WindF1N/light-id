import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import Service from './../Service'
const service = new Service()

function Description({access, setAccess, refresh, setRefresh, requestUser, setRequestUser, setRefreshRequired, post, setShowDescriptionPost, posts, setPosts}) {

  const navigate = useNavigate();
  const block = useRef(null);
  const description = useRef(null);

  const header = useRef(null);
  const pTitle = useRef(null);
  const pUser = useRef(null);
  const stats = useRef(null);
  const pDescription = useRef(null);

  function preventDefault(e){
    e.preventDefault();
  }

  const touchMove = (e) => {
    block.current.style.height = window.innerHeight - e.touches[0].clientY + 'px';
  }

  const touchEnd = (e) => {
    if (block.current.offsetTop < document.querySelector('#post'+post.id+' .media').offsetHeight / 2){
      block.current.style.transition = '.4s';
      block.current.style.height = '100%'
      setTimeout(() => {
        block.current.style.transition = 'transform .4s';
      }, 400)
    }else if (block.current.offsetTop > document.querySelector('#post'+post.id+' .media').offsetHeight / 2
        & block.current.offsetTop < window.innerHeight - ((window.innerHeight - document.querySelector('#post'+post.id+' .media').offsetHeight) / 2)){
      block.current.style.transition = '.4s';
      block.current.style.height = window.innerHeight - document.querySelector('#post'+post.id+' .media').offsetHeight + 5 + 'px';
      setTimeout(() => {
        block.current.style.transition = 'transform .4s';
      }, 400)
    }else if (block.current.offsetTop > window.innerHeight - ((window.innerHeight - document.querySelector('#post'+post.id+' .media').offsetHeight) / 2)){
      close()
    }
  }

  const close = (e) => {
    block.current.style.transform = "translateY("+ block.current.offsetHeight +"px)";
    document.body.classList.remove('lock');
    document.body.removeEventListener('touchmove', preventDefault);
    document.querySelector('#post'+post.id+' .storie').style.transform = "translateY(0)";
    setTimeout(() => setShowDescriptionPost(false), 300);
  }

  useEffect(() => {
    if (block){
      document.querySelector('body').classList.add('lock');
      document.body.addEventListener('touchmove', preventDefault, { passive: false });
      block.current.style.height = window.innerHeight - document.querySelector('#post'+post.id+' .media').offsetHeight + 5 + 'px';
      setTimeout(() => {
        if (description.current.offsetHeight < pTitle.current.offsetHeight + pUser.current.offsetHeight + stats.current.offsetHeight + pDescription.current.offsetHeight){
          description.current.addEventListener('touchmove', function(e){e.stopPropagation()}, false);
        }
      }, 400)
      document.querySelector('#post'+post.id+' .storie').style.transform = "translateY(-120px)";
      return function () {
        document.body.removeEventListener('touchmove', preventDefault);
      }
    }
  }, [block])

  return (
    <>
    <div className="comments" ref={block}>
      <div className="commentsHeader" ref={header} onTouchMove={touchMove} onTouchEnd={touchEnd}>
        <div>
          <div className="tongue"></div>
        </div>
        <div>
          <div>Описание</div>
          <div><img src={require('./images/close.svg').default} alt="" onClick={close}/></div>
        </div>

      </div>
      <div className="postDescription" ref={description}>
        {post.title ?
          <div className="pTitle" ref={pTitle}>{post.title}</div>
          : <div ref={pTitle}></div>
        }
        <div className="pUser" ref={pUser} onClick={() => navigate('/'+post.user.username)}>
          <div className="avatar">
            <img src={post.user.avatar ? post.user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt=""/>
          </div>
          <div className="username">
            {post.user.username} <br/>
            <span>{post.user.subscribers_count} подписчиков</span>
          </div>
        </div>
        <div className="stats" ref={stats}>
          <div className="stat">
            <div>{post.likes_count}</div>
            <div>Отметки "Нравится"</div>
          </div>
          <div className="stat">
            <div>{post.date.replace('г.', '')}</div>
            <div>Дата публикации</div>
          </div>
        </div>
        <div className="pDescription" ref={pDescription}>{post.description}</div>
      </div>
    </div>
    </>
  );
}
export default Description;
