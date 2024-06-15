import React, { useState, useEffect } from 'react';
import LazyLoad from "react-lazyload";
import { Link, useNavigate } from 'react-router-dom'
import ActionsPost from '../Actions/ActionsPost'
import Comments from './Comments'
import Description from './Description'
import Service from './../Service'
const service = new Service()

function Posts({access, setAccess, refresh, setRefresh, requestUser, setRequestUser, setRefreshRequired, posts, setPosts, nextPage, setNextPage, stop, setStop, firstPage}) {

  const navigate = useNavigate();

  const [postLikedId, setPostLikedId] = useState(null)
  const [postSavedId, setPostSavedId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showActionsPost, setShowActionsPost] = useState(false)
  const [showCommentsPost, setShowCommentsPost] = useState(false)
  const [showDescriptionPost, setShowDescriptionPost] = useState(false)
  const [selectPost, setSelectPost] = useState(null)
  const [selectPostId, setSelectPostId] = useState(null)

  const [commentText, setCommentText] = useState(null)
  const [checkText, setCheckText] = useState(false)

  const [showPostComments, setShowPostComments] = useState(null)

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
      if (postLikedId){
        service.likePost(postLikedId, {'Authorization': `Bearer ${access}`}).then(function(result) {
          if (result.status === 401){
            setRefreshRequired(true);
          }else{
            setRefreshRequired(false);
            setPostLikedId(null);
            var boolean;
            if (result.data.message === 'add'){
              boolean = true
            }else if(result.data.message === 'delete'){
              boolean = false
            }
            var like_post = {...posts.filter((n) => postLikedId === n.id)[0], is_liked: boolean, likes_count: result.data.count};
            setPosts([...posts.filter((n) => postLikedId < n.id), like_post, ...posts.filter((n) => postLikedId > n.id)])
          }
        });
      }
    }
  }, [access, postLikedId])

  useEffect(() => {
    if (access){
      if (postSavedId){
        service.savePost(postSavedId, {'Authorization': `Bearer ${access}`}).then(function(result) {
          if (result.status === 401){
            setRefreshRequired(true);
          }else{
            setRefreshRequired(false);
            setPostSavedId(null);
            var boolean;
            if (result.data.message === 'add'){
              boolean = true
            }else if(result.data.message === 'delete'){
              boolean = false
            }
            var save_post = {...posts.filter((n) => postSavedId === n.id)[0], is_saved: boolean};
            setPosts([...posts.filter((n) => postSavedId < n.id), save_post, ...posts.filter((n) => postSavedId > n.id)])
          }
        });
      }
    }
  }, [access, postSavedId])

  useEffect(() => {
    if (access){
      if (commentText) {
        service.addComment(selectPost.id, commentText, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 201){
            setCommentText(null);
            setRefreshRequired(false);
            setPosts([...posts.filter((n) => selectPost.id < n.id), {...posts.filter((n) => selectPost.id === n.id)[0], last_comment: result.data.result, comments_count: 1}, ...posts.filter((n) => selectPost.id > n.id)])
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, commentText, posts])

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

  const handleScroll = (event) => {
    let count = event.target.dataset.count;
    let scrollLeft = (event.target.scrollLeft - 30) / count;
    event.target.offsetParent.children[1].children[0].style.transform = 'translateX('+ scrollLeft +'px)';
  }

  const showAll = (description, event) => {
    event.target.offsetParent.children[1].innerHTML = description
  }

  const addLike = (id, post, e) => {
    setPostLikedId(id);
    if (e.target.dataset.liked == "false"){
      e.target.src = require('./images/like-active.svg').default;
      e.target.dataset.liked = "true";
      post.likes_count = post.likes_count + 1;
    }else{
      e.target.src = require('./images/like.svg').default;
      e.target.dataset.liked = "false";
      post.likes_count = post.likes_count - 1;
    }
  }

  const savePost = (id, post, e) => {
    setPostSavedId(id);
    if (e.target.dataset.saved == "false"){
      e.target.src = require('./images/save-active.svg').default;
      e.target.dataset.saved = "true";
    }else{
      e.target.src = require('./images/save.svg').default;
      e.target.dataset.saved = "false";
    }
  }

  const showMore = (e) => {
    if (requestUser.username === e.target.dataset.username){
      setShowActionsPost(true);
      setSelectPostId(e.target.dataset.postid);
    }
  }

  const share = (e) => {
    if (navigator.share) {
      navigator.share({
        url: e.target.dataset.share,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      alert('Share not supported on this browser, do it the old way.');
    }
  }

  const showDescription = (c, e) => {
    document.querySelector('#post'+c.id+' .media').scrollIntoView({block: "start", behavior: "smooth"});
    setShowDescriptionPost(true);
    setSelectPost(c);
  }

  const showComments = (c, e) => {
    document.querySelector('#post'+c.id+' .media').scrollIntoView({block: "start", behavior: "smooth"});
    setShowCommentsPost(true);
    setSelectPostId(c.id);
    setSelectPost(c);
  }

  const addComment = (c, e) => {
    if (document.querySelector('#post'+c.id+' .lastComment .add textarea').value){
      setSelectPost(c);
      setCommentText(document.querySelector('#post'+c.id+' .lastComment .add textarea').value);
      document.querySelector('#post'+c.id+' .lastComment .add textarea').value = null;
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
      <div className="posts">
        {posts?.map(c =>
          <div className="post" id={'post'+c.id} key={c.id}>
            <div className="postHeader">
              <div className="storie">
                <Link to={"/"+c.user.username}>
                  <LazyLoad once className="avatar" placeholder={c.user.avatar ? c.user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={c.user.name}>
                    <img src={c.user.avatar ? c.user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={c.user.name} />
                  </LazyLoad>
                </Link>
              </div>
              <div className="user">
                <div><Link to={"/"+c.user.username}>{c.user.username}</Link></div>
                <div>{c.user.subscribers_count} подписчиков</div>
                <div></div>
              </div>
              {requestUser.username === c.user.username ?
                <div className="more" onClick={showMore} data-username={c.user.username} data-postid={c.id}>
                  <img src={require('./images/more.svg').default} alt=""/>
                </div>
              :
                <div className="more">
                  <img src={require('./images/more.svg').default} alt=""/>
                </div>
              }
            </div>
            <div className="media">
              <div className="files" onScroll={handleScroll} data-count={c.items.length}>
                {c.items?.map(i =>
                  <LazyLoad once className="file" placeholder={<img src={i.placeholder ? i.placeholder : i.file} alt={c.user.name} key={i.pk} />} key={i.id}>
                    <img src={i.file} alt={c.user.name} key={i.pk} />
                  </LazyLoad>
                )}
              </div>
              {c.items.length > 1 ?
              <div className="scrollbar">
                <div className="active" style={{width: (100 / c.items.length) + '%'}}></div>
              </div> : ''
              }
            </div>
            <div className="postTitle" onClick={showDescription.bind(this, c)}>
              {c.title ?
                <span>{c.title.trim()}</span>
              :
                c.description &&
                  <span>{c.description.replace('\n', '')}</span>
              }
              <img src={require('./images/arrow-down2.svg').default} alt=""/>
              <div className="underTitle">
                {c.date}
              </div>
            </div>
            <div className="actions">
              <div className="list">
                <div className="action">
                  {c.is_liked? <img src={require('./images/like-active.svg').default} alt="" onClick={addLike.bind(this, c.id, c)} data-liked="true"/>
                  : <img src={require('./images/like.svg').default} alt="" onClick={addLike.bind(this, c.id, c)} data-liked="false"/>}
                  <div>
                    {c.likes_count > 0 ? c.likes_count : 'Нравится'}
                  </div>
                </div>
                <div className="action">
                  <img src={require('./images/share.svg').default} alt="" />
                  <div>
                    Отправить
                  </div>
                </div>
                <div className="action">
                  <img src={require('./images/share2.svg').default} alt="" onClick={share} data-share={window.location.origin + '/' + c.user.username + "/posts#post" + c.id} />
                  <div>
                    Поделиться
                  </div>
                </div>
                <div className="action">
                  {c.is_saved? <img src={require('./images/save-active.svg').default} alt="" onClick={savePost.bind(this, c.id, c)} data-saved="true" />
                  : <img src={require('./images/save.svg').default} alt="" onClick={savePost.bind(this, c.id, c)} data-saved="false" />}
                  <div>
                    Сохранить
                  </div>
                </div>
              </div>
            </div>
            <div className="lastComment" onClick={c.comments_count > 0 ? showComments.bind(this, c) : showPostComments?.id === c.id ? (e) => setShowPostComments(null) : (e) => setShowPostComments(c)}>
              <div className="lastCommentHeader">
                Комментарии {c.comments_count > 0 ? <span>{c.comments_count}</span> : null }
                <img src={require('./images/arrow-top-down.svg').default} alt=""/>
              </div>
              <div className={c.comments_count > 0 ? "item" : showPostComments?.id === c.id ? "item" : "item close"}>
                {c.comments_count > 0 ?
                  <>
                    <div className="avatar" onClick={(e) => {e.stopPropagation();navigate("/"+c.last_comment.username)}}>
                      <img src={c.last_comment.avatar ? c.last_comment.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt="" />
                    </div>
                    <div className="text">
                      {c.last_comment.text}
                    </div>
                  </>
                :
                  <>
                    <div className="avatar">
                      <img src={requestUser.avatar ? requestUser.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt="" />
                    </div>
                    <div className="add">
                      <textarea placeholder="Введите текст комментария" onChange={checkInput} onClick={(e) => e.stopPropagation()}></textarea>
                      {checkText &&
                        <div className="send" onClick={addComment.bind(this, c)}>
                          <img src={require('./images/send.svg').default} alt="" />
                        </div>
                      }
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        )}
      </div>
      {showDescriptionPost ? <Description access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired} post={selectPost} setShowDescriptionPost={setShowDescriptionPost} posts={posts} setPosts={setPosts}/> : null}
      {showCommentsPost ? <Comments access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired} postid={selectPostId} post={selectPost} setShowCommentsPost={setShowCommentsPost} posts={posts} setPosts={setPosts}/> : null}
      {showActionsPost ? <ActionsPost access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired} postid={selectPostId} setShowActionsPost={setShowActionsPost} posts={posts} setPosts={setPosts}/> : null}
    </>

  );
}
export default Posts;
