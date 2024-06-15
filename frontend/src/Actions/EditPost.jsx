import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './../App.css';

import Service from './../Service'
const service = new Service()

function EditPost({post, setEdit, setShowActionsPost, posts, setPosts}) {

  const navigate = useNavigate();

  const [access, setAccess] = useState(localStorage.getItem('accessToken'))
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
  const [refreshRequired, setRefreshRequired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [publicate, setPublicate] = useState(false)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)

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
      if (publicate){
        service.editPost(post.id, title, description, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setPosts([...posts.filter(n => n.id > post.id), result.data, ...posts.filter(n => n.id < post.id)]);
            setLoading(false);
            setPublicate(false);
            setEdit(false)
            setShowActionsPost(false);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, publicate])

  const publication = e => {
    setLoading(true);
    if (document.querySelector('textarea[name="title"]').value){
      setTitle(document.querySelector('textarea[name="title"]').value);
      setDescription(document.querySelector('textarea[name="description"]').value);
      setPublicate(true);
    }else{
      setLoading(false);
      setError(true);
    }
  }

  const back = e => {
    setEdit(false)
  }

  return (
    <div className="add-publication right">
      <div className="addHeader">
        <div className="cancel" onClick={back}>
          Отмена
        </div>
        <div className="text">
          Редактирование
        </div>
        <div className="publish" onClick={!loading && publication}>
          {loading ? <img src={require('../Main/images/loading.gif')} alt="loading" width="25px"/> : "Готово"}
        </div>
      </div>
      <div className="settings">
        <div className="default">
          <div className="post">
            <img src={post.items[0].file} alt=""/>
          </div>
          <div>
            <div className="text">
              <textarea name="title" placeholder="Добавьте заголовок" defaultValue={post.title} className={error && "error"} onChange={()=>setError(false)}></textarea>
            </div>
            <div className="text">
              <textarea name="description" placeholder="Добавьте подпись" defaultValue={post.description} rows="16"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPost;
