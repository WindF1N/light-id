import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams, Link, useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'

import CropAvatar from '../Crop/CropAvatar'
import Back from '../Main/Back'

import Service from './../Service'
const service = new Service()

function Settings({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const formData = new FormData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usernameregexp = /^[0-9a-z_.]+$/i;

  const [showStatusSelect, setShowStatusSelect] = useState(false);

  const changeInput = (e) => {
    if (e.target.name === 'telegram'){
      if ("@" === e.target.value[0]){
        setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.replace(' ', '')}});
      }else{
        if (e.target.value){
          setRequestUser({...requestUser, ...{[e.target.name]: "@"+e.target.value.replace(' ', '')}});
        }else{
          setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.replace(' ', '')}});
        }
      }
    }else if (e.target.name === 'bio'){
      setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.substr(0,150)}});

    }else if (e.target.name === 'username'){
      if (error === 'username'){
        setError(null)
      }
      if (e.target.value){
        if (usernameregexp.test(e.target.value)){
          setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.substr(0,30)}});
        }else if (e.target.value[e.target.value.length - 1] === ' '){
          if (e.target.value.slice(-2) === '_ '){
            setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.replace('_ ', '.').substr(0,30)}});
          }else{
            setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.replace(' ', '_').substr(0,30)}});
          }
        };
      }else{
        setRequestUser({...requestUser, ...{[e.target.name]: e.target.value.substr(0,30)}});
      }
    }else{
      setRequestUser({...requestUser, ...{[e.target.name]: e.target.value}});
    }

    if (e.target.value){
      e.target.parentNode.children[1].style.transform = "translateY(-12px)";
      e.target.parentNode.children[1].style.fontSize = "10px";
    }else{
      e.target.parentNode.children[1].style.transform = "translateY(0)";
      e.target.parentNode.children[1].style.fontSize = "14px";
    }
  }

  const focusInput = (e) => {
    e.target.parentNode.children[0].focus()
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

  const changeAvatar = async(e) => {
    let res = await readFile(e.target.files[0]);
    setAvatar(res);
    document.querySelector("input[name='new_avatar']").value = null;
  }

  useEffect(() => {
    if (access){
      if (loading){
        requestUser.avatar_blob && formData.append('files', requestUser.avatar_blob);
        requestUser.name && formData.append('first_name', requestUser.name);
        requestUser.last_name && formData.append('last_name', requestUser.last_name);
        requestUser.username && formData.append('username', requestUser.username);
        requestUser.sex && formData.append('sex', requestUser.sex);
        requestUser.birth_date && formData.append('birth_date', requestUser.birth_date);
        requestUser.city && formData.append('city', requestUser.city);
        requestUser.bio && formData.append('bio', requestUser.bio);
        requestUser.category && formData.append('category', requestUser.category);
        requestUser.position && formData.append('position', requestUser.position);
        requestUser.company && formData.append('company', requestUser.company);
        requestUser.phone && formData.append('phone', requestUser.phone);
        requestUser.telegram && formData.append('telegram', requestUser.telegram);
        requestUser.site && formData.append('site', requestUser.site);

        service.changeAcc(formData, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setLoading(false);
            setRequestUser(result.data.data);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }else if (result.status === 400){
            setLoading(false);
            if (result.data.error === 'username is taken by another user'){
              setError('username')
            }
          }
        })
      }
    }
  })

  const changeProfile = (e) => {
    setLoading(true)
  }

  const logout = (e) => {
    setRequestUser(null)
    localStorage.removeItem('accessToken');
    setAccess(null);
    localStorage.removeItem('refreshToken');
    setRefresh(null);
    navigate("/");
  }

  const onOff = (e) => {
    if (e.target.classList.contains('on_off')){
      if (e.target.classList.contains('active')){
        e.target.classList.remove('active');
        e.target.classList.add('disactive');
      }else{
        e.target.classList.remove('disactive');
        e.target.classList.add('active');
      }
    }else{
      if (e.target.parentElement.classList.contains('active')){
        e.target.parentElement.classList.remove('active');
        e.target.parentElement.classList.add('disactive');
      }else{
        e.target.parentElement.classList.remove('disactive');
        e.target.parentElement.classList.add('active');
      }
    }
  }

  return (
    requestUser ?
      <>
      <div className="settings">
        <div className="settingsHeader">
          <div className="name">
            LIGHT ID {requestUser.id}
          </div>
          <div className="change" onClick={changeProfile}>
            {loading ? <img src={require('../Main/images/loading.gif')} alt="loading" width="25px"/> : "Готово"}
          </div>
        </div>
        <div className="block-form">
          <div className="inputs withavatar">
            <div className={error === 'username' ? "input single error" : "input single"}>
              <input type="text" name="username" value={requestUser.username !== requestUser.phone ? requestUser.username : null} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.username !== requestUser.phone ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Имя пользователя
              </div>
            </div>
            <div className="input first">
              <input type="text" name="name" value={requestUser.name} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.name ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Имя
              </div>
            </div>
            <div className="input">
              <input type="text" name="last_name" value={requestUser.last_name} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.last_name ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Фамилия
              </div>
            </div>
            {/* <div className="input">
              <select name="sex" onChange={changeInput} value={requestUser.sex}>
                <option value="Мужской">Мужской</option>
                <option value="Женский">Женский</option>
              </select>
              <div className="placeholder" style={requestUser.sex ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Пол
              </div>
            </div> */}
            <div className="input last">
              <input type="date" name="birth_date" value={requestUser.birth_date} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.birth_date ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Дата рождения
              </div>
            </div>
            {/* <div className="input last">
              <input type="text" name="city" value={requestUser.city} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.city ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Город
              </div>
            </div> */}
          </div>
          <div className="changeAvatar">
            <img src={requestUser.avatar ? requestUser.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt=""/>
            <div className="icon">
              <img src={require("../Main/images/camera.svg").default} alt=""/>
            </div>
            <input type="file" name="new_avatar" accept="image/*" onChange={changeAvatar}/>
          </div>
        </div>
        {/* <div className="block-form">
          <div className="inputs">
            <div className={showStatusSelect ? "button first" : "button last first"} onClick={() => {showStatusSelect ? setShowStatusSelect(false) : setShowStatusSelect(true)}}>
              <div className="placeholder">
                Статус пользователя
              </div>
              <div className="selected">
                Platinum
              </div>
            </div>
            <div className="options" style={showStatusSelect === false ? {maxHeight: 0, boxShadow: "0 0px 0px 0px rgba(0, 0, 0, .4)"} : {maxHeight: "100vh", boxShadow: "0 50px 40px 20px rgba(11, 11, 11, .4)"}}>
              <div className="button">
                <div className="placeholder">
                  <span className="statusTitle yellow">GOLD</span><br/>
                  <div className="statusDescription">Чтобы получить пожизненное GOLD Членство, вам нужно купить любое количество ТОКЕНОВ всего один раз!</div>
                </div>
              </div>
              <div className="button">
                <div className="placeholder">
                  <span className="statusTitle">PLATINUM </span>
                  <span className="selectedStatus"><b>·</b> Текущий статус</span><br/>
                  <div className="statusDescription">Чтобы получить пожизненное PLATINUM Членство, вам нужно совершить на сайте покупок на сумму 5 000₽</div>
                </div>
              </div>
              <div className="button">
                <div className="placeholder">
                  <span className="statusTitle">DIAMOND</span><br/>
                  <div className="statusDescription">Чтобы получить пожизненное DIAMOND Членство, вам нужно совершить на сайте покупок на сумму 15 000₽</div>
                </div>
              </div>
              <div className="button">
                <div className="placeholder">
                  <span className="statusTitle">EXCLUSIVE</span><br/>
                  <div className="statusDescription">Чтобы получить GOLD Членство, сумма ваших покупок в месяц должна быть не менее 15 000₽ после того, как вы достигли статус DIAMOND!</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="block-form">
          <div className="inputs">
            <div className="input first last">
              <textarea name="bio" onChange={changeInput} rows="4" value={requestUser.bio}></textarea>
              <div className="placeholder" style={requestUser.bio ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                О себе
              </div>
              <span id="bio_length">{150 - requestUser.bio.length}</span>
            </div>
          </div>
        </div>
        {/* <div className="block-form">
          <div className="inputs">
            <div className="button first last">
              <div className="placeholder">
                Верификация
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="block-form">
          <div className="inputs">
            <div className="button first last">
              <div className="placeholder">
                FaceID
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="block-form">
          <div className="inputs">
            <div className="input first last">
              <input type="text" name="category" value={requestUser.category} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.category ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Категория
              </div>
            </div>
          </div>
        </div>
        <div className="block-form">
          <div className="inputs">
            <div className="input first">
              <input type="text" name="position" value={requestUser.position} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.position ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Должность
              </div>
            </div>
            <div className="input last">
              <input type="text" name="company" value={requestUser.company} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.company ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Компания
              </div>
            </div>
          </div>
        </div>
        <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                {requestUser.phone}
              </div>
            </div>
            <div className="input">
              <input type="text" name="telegram" value={requestUser.telegram} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.telegram ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Telegram @
              </div>
            </div>
            <div className="input last">
              <input type="text" name="site" value={requestUser.site} onChange={changeInput}/>
              <div className="placeholder" style={requestUser.site ? {transform: "translateY(-12px)", fontSize: "10px"} : {}} onClick={focusInput}>
                Сайт
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                Подписки и приглашения
              </div>
            </div>
            <div className="button last">
              <div className="placeholder">
                Заблокированные аккаунты
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first last">
              <div className="placeholder">
                Промокод
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first last">
              <div className="placeholder">
                Аналитика
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                Монетизация
              </div>
            </div>
            <div className="button last">
              <div className="placeholder">
                Купить токены
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                Вывод средств
              </div>
            </div>
            <div className="button last">
              <div className="placeholder">
                Платежи
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                Центр поддержки
              </div>
            </div>
            <div className="button last">
              <div className="placeholder">
                О приложении
              </div>
            </div>
          </div>
        </div>

        <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                Показ в профиле
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Выбирать главное фото Автоматически
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Показывать моих подписчиков
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Показывать мои подписки
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Скрывать возраст
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Push-уведомления
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Синхронизация контактов
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Скрывать онлайн-статус
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Закрытый аккаунт
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
            <div className="button last">
              <div className="placeholder">
                Тёмная тема
              </div>
              <div className="on_off active" onClick={onOff}>
                <div></div>
                <div className="point"></div>
                <div></div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="block-form">
          <div className="inputs">
            {/* <div className="button first">
              <div className="placeholder">
                Добавить новый аккаунт
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Добавить новый Бизнес аккаунт
              </div>
            </div> */}
            <div className="button first" onClick={() => navigate('/settings/delete/profile')}>
              <div className="placeholder">
                Удалить аккаунт
              </div>
            </div>
            <div className="button last" onClick={logout}>
              <div className="placeholder">
                Выйти из аккаунта
              </div>
            </div>
          </div>
        </div>

        {/* <div className="block-form">
          <div className="inputs">
            <div className="button first">
              <div className="placeholder">
                Показ в профиле
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Материальное положение
              </div>
            </div>
            <div className="button">
              <div className="placeholder">
                Условия проживания
              </div>
            </div>
            <div className="button" onClick={logout}>
              <div className="placeholder">
                Дети
              </div>
            </div>
            <div className="button" onClick={logout}>
              <div className="placeholder">
                Образование
              </div>
            </div>
            <div className="button" onClick={logout}>
              <div className="placeholder">
                Языки
              </div>
            </div>
            <div className="button" onClick={logout}>
              <div className="placeholder">
                Курение
              </div>
            </div>
            <div className="button" onClick={logout}>
              <div className="placeholder">
                Алкоголь
              </div>
            </div>
            <div className="button" onClick={logout}>
              <div className="placeholder">
                Знак зодиака
              </div>
            </div>
            <div className="button last" onClick={logout}>
              <div className="placeholder">
                Рост
              </div>
            </div>
          </div>
        </div> */}

      </div>
      {avatar && <CropAvatar avatar={avatar} setAvatar={setAvatar} requestUser={requestUser} setRequestUser={setRequestUser}/>}
      <Back />
      </>
    : null
  );
}
export default Settings;
