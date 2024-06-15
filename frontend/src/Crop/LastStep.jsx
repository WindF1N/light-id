import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './../App.css';

import Service from './../Service'
const service = new Service()

function LastStep({images, setNextStep}) {

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
        service.publicationUpload(title, description, images, {'Authorization': `Bearer ${access}`, 'Content-Type' : 'multipart/form-data'}).then(function(result){
          if (result.status === 201){
            setLoading(false);
            navigate('/'+result.data.user.username + '/posts#post' + result.data.id)
            setPublicate(false)
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
    setNextStep(false)
  }

  return (
    <div className="add-publication right">
      <div className="addHeader">
        <div className="cancel" onClick={back}>
          Назад
        </div>
        <div className="text">
          Новая публикация
        </div>
        <div className="publish" onClick={!loading && publication}>
          {loading ? <img src={require('../Main/images/loading.gif')} alt="loading" width="25px"/> : "Поделиться"}
        </div>
      </div>
      <div className="settings">
        <div className="default">
          <div className="post">
            <img src={images[0].new} alt=""/>
          </div>
          <div>
            <div className="text">
              <textarea name="title" placeholder="Добавьте заголовок" className={error && "error"} onChange={()=>setError(false)}></textarea>
            </div>
            <div className="text">
              <textarea name="description" placeholder="Добавьте подпись" rows="16"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LastStep;
