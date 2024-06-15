import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import Crop from '../Crop/Crop'

import Service from './../Service'
const service = new Service()

function Buttons({access, setAccess, refresh, setRefresh, requestUser, setRequestUser, setRefreshRequired}) {

  const [files, setFiles] = useState([])
  const [next, setNext] = useState(false)

  const openMenu = e => {
    e.preventDefault();
    if (document.querySelector('#open-menu').style.transform != 'rotate(180deg)'){
      document.querySelector('#open-menu').style.transform = 'rotate(180deg)';
      let elements = document.querySelectorAll('.button.item');
      elements.forEach(el => {
        if (!el.classList.contains('back')){
          el.style.opacity = 1;
          el.style.transform = 'translateY(0) scale(1)';
        }
      });
    }else{
      document.querySelector('#open-menu').style.transform = 'rotate(0deg)';
      let elements = [].slice.call(document.querySelectorAll('.button.item'), 0).reverse();
      elements.slice().reverse().forEach(el => {
        if (!el.classList.contains('back')){
          el.style.opacity = 0;
          el.style.transform = 'translateY(600px) scale(.8)'
        }
      });
    }
  }

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  }

  const loadFiles = async(e) => {
    let list = [];
    for (let i = 0; i < e.target.files.length; i++){
      let res = await readFile(e.target.files[i]);
      list.push(res);
    }
    setFiles(list);
    document.querySelector("input[name='new_post']").value = null;
    setNext(true);
  }

  return (
    <>
      <div className="main buttons">
        <div className="main button item" >
          <img src={require('./images/menu-add.svg').default} alt=""/>
          <div className="hidden">
            <input type="file" name="new_post" accept="image/*" multiple onChange={loadFiles} />
          </div>
        </div>
        <div className="main button item">
          <Link to="/messenger/inbox">
          <img src={require('./images/messanger.svg').default} alt=""/>
          </Link>
        </div>
        <div className="main button item">
          <Link to="/">
            <img src={require('./images/menu-home-button.svg').default} alt=""/>
          </Link>
        </div>
        <div className="main button item">
          <Link to="/search/all">
            <img src={require('./images/menu-search-button.svg').default} alt=""/>
          </Link>
        </div>
        <div className="main button item">
          <Link to="/activity/all">
            <img src={require('./images/menu-activity-button.svg').default} alt=""/>
          </Link>
        </div>
        <div className="main button item">
          {requestUser ?
            <Link to={"/"+requestUser.username}>
              <img src={requestUser.avatar ? requestUser.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={requestUser.name} />
            </Link>
          : null}
        </div>
        <div className="main button" onClick={openMenu} id="open-menu">
          <img src={require('./images/menu-button.svg').default} alt=""/>
        </div>
      </div>
      {next ?
        <Crop files={files} setNext={setNext}/>
      : null}
    </>
  );
}
export default Buttons;
