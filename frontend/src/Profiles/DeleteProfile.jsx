import React, { useState } from 'react';
import LazyLoad from "react-lazyload";
import InputMask from 'react-input-mask'
// import { Link } from 'react-router-dom'
import Back from '../Main/Back'

function DeleteProfile() {

  const [phone, setPhone] = useState('+7 ')
  const [code, setCode] = useState('')
  const [next, setNext] = useState(false)
  const [complete, setComplete] = useState(false)

  const focusInput = (e) => {
    document.querySelector('.auth').style.overflowY = 'hidden';
  }

  const changeInputPhone = (e) => {
    setPhone(e.target.value)
    if (e.target.value.length === 16){
      setTimeout(function(){
        setNext(true)
      }, 300)
    };
  }

  const changeInputCode = (e) => {
    setCode(e.target.value)
    if (e.target.value.length === 7){
      setComplete(true)
    }
  }

  return (
    <>
    <div className="auth" style={{height: window.innerHeight}}>
      <div className="form">
        <div className="logo mt100">
          <img src={require('../Main/images/Logo.svg').default} alt="" />
        </div>
        {!next &&
        <div className="move-text">
          Введите номер телефона <br/> для удаления аккаунта
        </div>}
        {!complete ?
          <form>
            {next &&
              <><InputMask maskPlaceholder="" mask="999 999" type="tel" name="code" value={code} autoFocus={true} onFocus={focusInput} onChange={changeInputCode}/><div>Введите код</div></> }
            {!next &&
              <><InputMask maskPlaceholder="" mask="+7 999 999 99-99" type="tel" name="phone" value={phone} autoFocus={true} onFocus={focusInput} onChange={changeInputPhone}/><div>Номер телефона</div></>}

          </form>
        :
          <>
            <div className="move-text big">
              Аккаунт удалён
            </div>
            <div className="complete">
              Вся ваша переписка, контакты, а также фото и настройки будут храниться 200 дней с момента удаления (до 2 нояб. 2022 г.). В случае восстановления анкеты, её нельзя будет удалить в течение 3 дней.
            </div>
          </>
        }
      </div>
    </div>
    <Back />
    </>
  );
}
export default DeleteProfile;
