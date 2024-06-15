import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

function Header(){
  return (
    <div className="header">
      <div className="logo">
        <Link to="/">
          <img src={require('./images/Logo.svg').default} alt=""/>
        </Link>
      </div>
      <div className="timer">
        <div className="countdown">
          <div>
            <div className="bloc-time years" data-init-value="0">
             <span className="count-title">Годы</span>

             <div className="figure years years-1">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>

             <div className="figure years years-2">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>
           </div>

            <div className="bloc-time days" data-init-value="0">
             <span className="count-title">Дни</span>

             <div className="figure days days-1">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>

             <div className="figure days days-2">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>

             <div className="figure days days-3">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>
           </div>

           <div className="bloc-time hours" data-init-value="0">
             <span className="count-title">Часы</span>

             <div className="figure hours hours-1">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>

             <div className="figure hours hours-2">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>
           </div>

           <div className="bloc-time min" data-init-value="0">
             <span className="count-title">Мин</span>

             <div className="figure min min-1">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>

             <div className="figure min min-2">
              <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>
           </div>

           <div className="bloc-time sec" data-init-value="0">
             <span className="count-title">Сек</span>

               <div className="figure sec sec-1">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>

             <div className="figure sec sec-2">
               <span className="top">0</span>
               <span className="top-back">
                 <span>0</span>
               </span>
               <span className="bottom">0</span>
               <span className="bottom-back">
                 <span>0</span>
               </span>
             </div>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
