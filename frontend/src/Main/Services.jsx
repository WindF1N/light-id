import React, { Component } from 'react';
import LazyLoad from "react-lazyload";
// import { Link } from 'react-router-dom'

class Services extends Component {
  render() {
    return (
      <div className="services">
        <div className="service">
          <img src={require('./images/community.svg').default} alt=""/>
          <div>Сообщества</div>
        </div>
        <div className="service">
          <img src={require('./images/acquaintance.svg').default} alt=""/>
          <div>Знакомства</div>
        </div>
        <div className="service">
          <img src={require('./images/music.svg').default} alt=""/>
          <div>Музыка</div>
        </div>
        <div className="service">
          <img src={require('./images/ads.svg').default} alt=""/>
          <div>Объявления</div>
        </div>
      </div>
    );
  }
}
export default Services;
