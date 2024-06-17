import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import Service from './../Service'
const service = new Service()

function Comments({access, setAccess, refresh, setRefresh, requestUser, setRequestUser, setRefreshRequired, postid, post, setShowCommentsPost, posts, setPosts}) {

  const navigate = useNavigate()

  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)

  const [commentLikedId, setCommentLikedId] = useState(null)
  const [commentText, setCommentText] = useState(null)
  const [checkText, setCheckText] = useState(false)

  const [nextPage, setNextPage] = useState("/api/posts/"+ postid +"/comments?page=1")
  const [firstPage, setFirstPage] = useState("/api/posts/"+ postid +"/comments?page=1")

  const block = useRef(null);
  const list = useRef(null);
  const newcomment = useRef(null);
  const comments_list = useRef(null);

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
    block.current.style.transform = "translateY(100vh)";
    document.body.classList.remove('lock');
    document.body.removeEventListener('touchmove', preventDefault);
    document.querySelector('#post'+post.id+' .storie').style.transform = "translateY(0)";
    setTimeout(() => {setShowCommentsPost(false)}, 300);
  }

  useEffect(() => {
    if (block){
      document.body.classList.add('lock');
      document.body.addEventListener('touchmove', preventDefault, { passive: false });
      list.current.addEventListener('touchmove', function(e){e.stopPropagation()}, false);
      console.log(post)
      block.current.style.height = window.innerHeight - document.querySelector('#post'+post.id+' .media').offsetHeight + 5 + 'px';
      setTimeout(() => {
        console.log(list.current.offsetHeight);
        console.log(comments_list.current.offsetHeight);
        if (list.current.offsetHeight < comments_list.current.offsetHeight){
          list.current.addEventListener('touchmove', function(e){e.stopPropagation()}, false);
        }
      }, 400)
      document.querySelector('#post'+post.id+' .storie').style.transform = "translateY(-120px)";
      return function () {
        document.body.removeEventListener('touchmove', preventDefault);
        list.current.removeEventListener('touchmove', function(e){e.stopPropagation()}, false);
      }
    }
  }, [block])

  useEffect(() => {
    if (access){
      if (commentText) {
        service.addComment(post.id, commentText, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 201){
            list.current.scrollTo({top: 0,behavior: "smooth"})
            setComments([result.data.result, ...comments]);
            setCommentText(null);
            setRefreshRequired(false);
            document.querySelectorAll('.comments .list .item')[0].classList.add("new");
            setTimeout(() => document.querySelectorAll('.comments .list .item.new')[0].classList.remove("new"), 1000);
            setPosts([...posts.filter((n) => post.id < n.id), {...posts.filter((n) => post.id === n.id)[0], last_comment: result.data.result}, ...posts.filter((n) => post.id > n.id)])
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    } else if (commentText) {
      navigate("/auth/login")
    }
  }, [access, commentText, posts])

  useEffect(() => {
    if (!stop){
      if (loading) {
        service.getPostComments(nextPage).then(function(result){
          if (result.status === 200){
            setRefreshRequired(false);
            setLoading(false);
            if (result.data.nextlink === firstPage){
              setStop(true)
            }
            setComments([...comments, ...result.data.result]);
            setNextPage(result.data.nextlink);
            setPosts([...posts.filter((n) => post.id < n.id), {...posts.filter((n) => post.id === n.id)[0], comments_count: result.data.count}, ...posts.filter((n) => post.id > n.id)])
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, stop, loading, posts])

  useEffect(() => {
    if (access){
      if (commentLikedId){
        service.likeComment(commentLikedId, {'Authorization': `Bearer ${access}`}).then(function(result) {
          if (result.status === 401){
            setRefreshRequired(true);
          }else{
            setRefreshRequired(false);
            setCommentLikedId(null);
          }
        });
      }
    } else if (commentLikedId) {
      navigate("/auth/login")
    }
  }, [access, commentLikedId])

  const addLikeComment = (id, comment, e) => {
    if (e.target.dataset.liked == "false"){
      e.target.src = require('./images/like-active.svg').default;
      e.target.dataset.liked = "true";
      comment.likes_count = comment.likes_count + 1;
    }else{
      e.target.src = require('./images/like.svg').default;
      e.target.dataset.liked = "false";
      comment.likes_count = comment.likes_count - 1;
    }
    setCommentLikedId(id);
  }

  const addComment = (e) => {
    if (newcomment.current.value){
      setCommentText(newcomment.current.value);
      newcomment.current.value = null;
    }
  }

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

  const checkInput = (e) => {
    if (e.target.value){
      setCheckText(true);
    }else{
      setCheckText(false);
    }
  }

  return (
    <>
    <div className="comments" ref={block}>
      <div className="commentsHeader" onTouchMove={touchMove} onTouchEnd={touchEnd}>
        <div>
          <div className="tongue"></div>
        </div>
        <div>
          <div>Комментарии <span>{comments ? comments.length : null}</span></div>
          <div><img src={require('./images/close.svg').default} alt="" onClick={close}/></div>
        </div>
      </div>
      <div className="list" ref={list}>
        <div ref={comments_list}>
        {comments?.map((comment, idx) =>
          <div className="item" key={idx}>
            <div className="avatar" onClick={() => navigate('/'+comment.username)}>
              <img src={comment.avatar ? comment.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={comment.username} />
            </div>
            <div>
              <div className="top">
                {comment.username} <b>·</b> {comment.date}
                {comment.likes_count > 0 ?
                <div className="likesCount">
                  {comment.likes_count}
                </div>
                 : null}
                {comment.is_liked? <img src={require('./images/like-active.svg').default} alt="" onClick={addLikeComment.bind(this, comment.id, comment)} data-liked="true"/>
                : <img src={require('./images/like.svg').default} alt="" onClick={addLikeComment.bind(this, comment.id, comment)} data-liked="false"/>}
              </div>
              <div className="text">
                {comment.text}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      <div className="add-comment">
        <div className="avatar">
          <img src={requestUser?.avatar ? requestUser.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt="" />
        </div>
        <div className="add">
          <textarea placeholder="Введите текст комментария" ref={newcomment} onChange={checkInput}></textarea>
        </div>
        {checkText &&
          <div className="send" onClick={addComment}>
            <img src={require('./images/send.svg').default} alt="" />
          </div>
        }
      </div>
    </div>
    </>
  );
}
export default Comments;
