import React, { useState, useEffect, useRef } from 'react';
import LazyLoad from "react-lazyload";
import { Link } from 'react-router-dom'
import EditPost from './EditPost'
import Service from './../Service'
const service = new Service()

function ActionsPost({access, setAccess, refresh, setRefresh, requestUser, setRequestUser, setRefreshRequired, postid, setShowActionsPost, posts, setPosts}) {

  const [action, setAction] = useState(null)
  const [edit, setEdit] = useState(false)
  const [post, setPost] = useState(null)

  const block = useRef(null)
  const actions = useRef(null)

  useEffect(() => {
    if (access){
      if (action){
        if (action === 'delete'){
          service.deletePost(postid, {'Authorization': `Bearer ${access}`}).then(function (result) {
            if (result.status === 204){
              var newPosts = posts.filter(n => n.id !== Number(postid));
              setAction(null)
              setPosts(newPosts);
              setRefreshRequired(false);
              setShowActionsPost(false);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          });
        }else if (action === 'edit'){
          var post = posts.filter(n => n.id === Number(postid));
          setPost(post[0]);
          setAction(null);
          setEdit(true);
        }
      }
    }
  }, [access, action, posts, post])

  const closeActions = (e) => {
    block.current.style.opacity = '0';
    actions.current.style.transform = 'translateY(600px)';
    setTimeout(() => setShowActionsPost(false), 400);
  }

  return (
    <>
    <div className="actionsPost" ref={block}></div>
    <div className="actions-block" ref={actions}>
      <div className="action" onClick={() => setAction('delete')}>
        Удалить
      </div>
      <div className="action" onClick={() => setAction('edit')}>
        Изменить
      </div>
      <div className="action" onClick={closeActions}>
        Отмена
      </div>
    </div>
    {edit ?
      <EditPost post={post} setEdit={setEdit} setShowActionsPost={setShowActionsPost} posts={posts} setPosts={setPosts}/>
    : null}
    </>
  );
}
export default ActionsPost;
