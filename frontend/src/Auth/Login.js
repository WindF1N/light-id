import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';


import Buttons from '../Main/Buttons'
import MaskedInput from 'react-input-mask';

import Service from '../Service'
const service = new Service();

function Login({ access, setAccess, refresh, setRefresh, refreshRequired, setRefreshRequired, loading, setLoading, error, setError, requestUser, setRequestUser, usersCount, setUsersCount }) {

  const navigate = useNavigate();

  const [phone, setPhone] = useState('+7 ')
  const [password, setPassword] = useState('')
  const [next, setNext] = useState(false)
  const [isPhoneFilled, setIsPhoneFilled] = useState(false);
  const [user, setUser] = useState(false);

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
      if (!requestUser){
        service.getUser({'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setRequestUser(result.data.data);
            setUsersCount(result.data.users_count);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, requestUser])

  const changeInputPhone = (e) => {
    setPhone(e.target.value)
    if (e.target.value.length === 16){
      setTimeout(function(){
        setNext(true)
      }, 300)
    };
  }

  const changeInputPassword = (e) => {
    setPassword(e.target.value)
  }

  const handleChange = (event) => {
    const phoneNumber = event.target.value.replace(/\s/g, '').replace('_', '');
    const isFilled = phoneNumber.length === 12;
    setIsPhoneFilled(isFilled);
    setPhone(phoneNumber);
    isFilled && console.log(phoneNumber)
  };

  useEffect(() => {
    if (isPhoneFilled) {
        service.getPostsByURL("/api/check_user/"+phone).then(function (result) {
            if (result.status === 200){
              setUser(result.data.data);
              setNext(true);
            }else if (result.status === 401){
              setError("Неверный номер телефона или код авторизации");
            }
        });
    }
  }, [isPhoneFilled])

  const [activeNumber, setActiveNumber] = useState(null);
  const [code, setCode] = useState([]);
  const [previousCode, setPreviousCode] = useState([]);
  const [ isCodeIncorrect, setIsCodeIncorrect ] = useState(error ? true: false);
  const [ avatar, setAvatar ] = useState(user?.avatar);

  const handleTouchStart = (number) => {
    setActiveNumber(number);
  };

  const handleTouchEnd = () => {
    setActiveNumber(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    service.login({username_or_phone: phone, password: Number(code.join(''))}).then(function(result){
      if (result.status === 200){
        setLoading(false);
        setPassword('');
        setNext(false);
        setPhone('');
        localStorage.setItem('accessToken', result.data.access);
        setAccess(result.data.access);
        localStorage.setItem('refreshToken', result.data.refresh);
        setRefresh(result.data.refresh);
        setError(null);
        navigate("/", {"replace": true})
      }else if (result.status === 401){
        if (result.data.detail === "No active account found with the given credentials"){
          setLoading(false);
          setPassword('');
          setCode([]);
          setError('Неверный код авторизации');
        }
      }
    })
  }

  const handleNumberClick = (number) => {
    if (isCodeIncorrect) {
      setIsCodeIncorrect(false);
      setError(null);
    };
    if (number !== "Выход" && number !== "Удалить") {
      if (code.length < 4) {
        setCode([...code, number]);
      }
    } else if (number === "Удалить") {
      setCode(prevState => prevState.slice(0, -1));
    } else if (number === "Выход") {
      setNext(false);
      setPhone(null);
      setError(null);
    }
  };

  useEffect(() => {
    if (previousCode.length === 0 && code.length === 4) {
      if (user) {
        handleSubmit();
      } else {
        setPreviousCode(code);
        setCode([]);
      }
    } else if (previousCode.length === 4 && code.length === 4) {
      const currentCode = code.join('');
      const previousCodeString = previousCode.join('');
      if (currentCode === previousCodeString) {
        // Код верифицирован успешно, очищаем состояние
        setIsCodeIncorrect(false);
        // Здесь выполняется действие после успешной верификации кода
        handleSubmit()
      } else {
        // Код неверен, устанавливаем флаг
        setCode([]);
        setPreviousCode([]);
        setIsCodeIncorrect(true);
      }
    }
  }, [code, previousCode])

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'Выход', 0, 'Удалить']

  if (!next) {
    return (
        <>
            <div className="view" style={{
                boxSizing: "border-box",
                overflow: "hidden",
                padding: "0 10px",
                position: "relative",
                width: "100%",
                height: "100vh"
            }}>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    gap: "30px",
                    height: "100vh",
                    justifyContent: "center",
                    padding: "0 10%",
                    width: "80%",
                }}>
                    <div style={{ fontSize: 16, fontWeight: 300, marginTop: -150 }}>Welcome to the World of</div>
                    <div style={{ marginTop: -20 }}>
                        <img src={require('../Main/images/Logo.svg').default} alt="" style={{ width: 135 }} />
                    </div>
                    <div style={{
                        borderBottom: ".5px solid #fff",
                        marginTop: "100px"
                    }}>
                        <div style={{ marginBottom: 10, fontWeight: 300 }}>Введите<br />номер телефона</div>
                        <div style={{
                            color: "#aaa",
                            fontSize: "14px",
                            fontWeight: 300
                        }}>Чтобы войти или стать клиентом</div>
                        <MaskedInput
                            mask="+7 999 999 99 99"
                            placeholder=""
                            maskChar={" "}
                            style={{
                                backgroundColor: "inherit",
                                border: 0,
                                borderRadius: 0,
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: 300,
                                lineHeight: "16px",
                                margin: 0,
                                outline: 0,
                                padding: "15px 0",
                                width: "100%"
                            }}
                            onChange={handleChange}
                            value={phone}
                        />
                    </div>
                </div>
            </div>
            <Buttons access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>
        </>
    );
  } else {
    return (
        <div className="view" style={{
            boxSizing: "border-box",
            overflow: "hidden",
            padding: "0 10px",
            position: "relative",
            width: "100%",
            height: "100vh"
        }}>
            <div style={{
                    display: "flex",
                    flexFlow: "column",
                    gap: "30px",
                    height: "100vh",
                    justifyContent: "center",
                    padding: "0 10%",
                    width: "80%",
                }}>
                {!user &&
                <>
                <div style={{display: "flex", flexFlow: "column", alignItems: "center", marginBottom: 50}}>
                    <img src={require('../Main/images/menu-button.svg').default} alt="" style={{width: 60}} />
                    <div style={{fontSize: 13, fontWeight: 300, marginTop: 5, textAlign: "center", color: "#D9CBCB"}}>
                    LIGHTid
                    </div>
                </div>
                {previousCode.length === 0 ?
                    <div style={{textAlign: "center", fontWeight: 300}}>Придумайте код<br/>для входа в приложение</div>
                : <div style={{textAlign: "center", fontWeight: 300}}>Повторите ранее введенный код<br/>для подтверждения</div>}
                </>}
                {user &&
                <>  
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20
                    }}>
                        <img src={user.avatar ? user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt="" style={{width: "20vw", height: "30vw", borderRadius: "10px", objectFit: "cover"}} />
                    </div>
                    <div style={{color: "#fff", textAlign: "center", fontWeight: 300, marginTop: -35}}>{user?.username ? user.username : user?.phone}</div>
                    <div style={{textAlign: "center", fontWeight: 300}}></div>
                    {error &&
                    <div style={{fontWeight: 300, fontSize: 12, color: "red", textAlign: "center", marginTop: -30, marginBottom: -10}}>{error}</div>}
                </>}
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", columnGap: 20}}>
                {[1, 2, 3, 4].map((_, index) => (
                    <div
                    key={index}
                    style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: isCodeIncorrect ? "red" : index < code.length ? "#007BFF" : "#333",
                    }}
                    ></div>
                ))}
                </div>
                {user &&
                <>
                {previousCode.length === 0 &&
                    <>
                    {isCodeIncorrect ? 
                    <div style={{fontSize: 12, fontWeight: 300, color: "#aaa", textAlign: "center"}}>Вы ввели 2 разных кода, попробуйте ещё раз</div>
                    : <div style={{fontSize: 12, fontWeight: 300, color: "#aaa", textAlign: "center"}}>В дальнейшем код будет использоваться<br/>для входа в приложение</div>}
                    </>
                }
                </>}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", paddingTop: 20, width: "90%", marginLeft: "5%" }}>
                {numbers.map((number, index) => (
                    <div
                    key={index}
                    style={{
                        width: "33%",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onTouchStart={() => handleTouchStart(number)}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => handleNumberClick(number)}
                    >
                    <div style={{
                        fontSize: number === 'Выход' || number === 'Удалить' ? 14 : 32,
                        fontWeight: number === 'Выход' || number === 'Удалить' ? 300 : 400,
                        color: number === 'Выход' || number === 'Удалить' ? "#aaa" : "white",
                        borderRadius: "50%",
                        backgroundColor: activeNumber === number && (number !== 'Выход' && number !== 'Удалить') ? '#333' : 'transparent',
                        transition: 'background-color 0.3s ease',
                        width: 45,
                        height: 45,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 10
                    }}>
                        {number}
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
  }

  
}

export default Login;
