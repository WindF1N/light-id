import React, { useState, useEffect } from 'react';
import LazyLoad from "react-lazyload";
import { useParams, Link, useNavigate } from 'react-router-dom'
import Service from './../Service'
const service = new Service()

function PostComments({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const navigate = useNavigate();
  const [post, setPost] = useState()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)

  const [commentLikedId, setCommentLikedId] = useState(null)
  const [commentText, setCommentText] = useState(null)

  const { post_id } = useParams();
  const [nextPage, setNextPage] = useState("/api/posts/"+ post_id +"/comments?page=1")
  const [firstPage, setFirstPage] = useState("/api/posts/"+ post_id +"/comments?page=1")

  useEffect(() => {
    if (access){
      if (commentText) {
        service.addComment(post_id, commentText, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 201){
            window.scrollTo({top: 0,behavior: "smooth"})
            setComments([result.data.result, ...comments]);
            setCommentText(null);
            setRefreshRequired(false);
            document.querySelectorAll('.comments .list .comment[data-object="comment"]')[0].classList.add("new");
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, commentText])

  useEffect(() => {
    var textarea = document.querySelector('textarea[placeholder="Добавьте комментарий"]');
    textarea.addEventListener('keyup', function(){
      if(this.scrollTop > 0){
        this.style.height = this.scrollHeight + "px";
      }
    });
  })

  useEffect(() => {
    if (access){
      if (!post) {
        service.getPost(post_id, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setPost(result.data);
            setRefreshRequired(false);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, post])

  useEffect(() => {
    if (access){
      if (!stop){
        if (loading) {
          service.getPostComments(nextPage, {'Authorization': `Bearer ${access}`}).then(function(result){
            if (result.status === 200){
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true)
              }
              setComments([...comments, ...result.data.result]);
              setNextPage(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          })
        }
      }
    }
  }, [access, stop, loading])

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
    document.querySelector('#comment'+id).innerHTML = `Нравится: ${comment.likes_count}`;
    setCommentLikedId(id);
  }

  const addComment = (e) => {
    if (e.target.parentElement.children[0].value){
      setCommentText(e.target.parentElement.children[0].value);
      e.target.parentElement.children[0].value = null;
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
      console.log('loading');
    }
  }

  return (
    <div className="comments">
      <div className="commentsHeader">
        <div className="back" onClick={() => navigate(-1)}>
          <img src={require('./images/back.svg').default} alt=""/>
        </div>
        <div className="title">
          Комментарии
        </div>
        <div className="share">
          <img src={require('./images/share.svg').default} alt=""/>
        </div>
      </div>
      <div className="list">
        {post ?
          post.description ?
            <div className="comment big">
              <LazyLoad once className="avatar">
                <img src={post.user.avatar ? post.user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={post.user.name} />
              </LazyLoad>
              <div>
                <div className="top">
                  <b>{post.user.username}</b>
                  <span style={{whiteSpace: "pre-wrap"}}>
                  {post.description}
                  </span>
                </div>
                <div className="bottom">
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          : null
        : null}
        {comments?.map(comment =>
          <div className="comment" key={comment.id} data-object="comment">
            <LazyLoad once className="avatar">
              <img src={comment.avatar ? comment.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={comment.username} />
            </LazyLoad>
            <div>
              <div className="top">
                <b>{comment.username}</b>
                <span>
                  {comment.text}
                </span>
              </div>
              <div className="bottom">
                <span>{comment.date}</span>
                <span id={'comment'+comment.id}>{comment.likes_count > 0 ? "Нравится: "+comment.likes_count : null}</span>
              </div>
              <div className="addlike">
                {comment.is_liked? <img src={require('./images/like-active.svg').default} alt="" onClick={addLikeComment.bind(this, comment.id, comment)} data-liked="true"/>
                : <img src={require('./images/like.svg').default} alt="" onClick={addLikeComment.bind(this, comment.id, comment)} data-liked="false"/>}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="add-comment">
        <div className="avatar">
          {requestUser ?
            <img src={requestUser.avatar ? requestUser.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={requestUser.name} />
          : null}
        </div>
        <div className="input">
          <textarea name="comment" placeholder="Добавьте комментарий"></textarea>
          <div className="publish" onClick={addComment}>
            Опубликовать
          </div>
        </div>
      </div>
    </div>
  );
}
export default PostComments;
