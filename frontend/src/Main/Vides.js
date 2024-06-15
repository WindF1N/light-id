import React, { Component } from 'react';
import LazyLoad from "react-lazyload";
// import { Link } from 'react-router-dom'

class Vides extends Component {
  render() {
    return (
      <>
        <div className="title">
          <div className="icon">
            <img src={require('./images/vide.svg').default} alt="" />
          </div>
          <div className="text">
            Vide
          </div>
        </div>
        <div className="vides">
          <div className="vide">
            <LazyLoad once className="poster">
              <img src={require('./images/vide-dev.svg').default} alt="" />
              <div className="overflow"></div>
            </LazyLoad>
            <div className="views">
              0 просмотров
            </div>
          </div>
          <div className="vide">
            <LazyLoad once className="poster">
              <img src={require('./images/vide-dev.svg').default} alt="" />
              <div className="overflow"></div>
            </LazyLoad>
            <div className="views">
              0 просмотров
            </div>
          </div>
          <div className="vide">
            <LazyLoad once className="poster">
              <img src={require('./images/vide-dev.svg').default} alt="" />
              <div className="overflow"></div>
            </LazyLoad>
            <div className="views">
              0 просмотров
            </div>
          </div>
          <div className="vide">
            <LazyLoad once className="poster">
              <img src={require('./images/vide-dev.svg').default} alt="" />
              <div className="overflow"></div>
            </LazyLoad>
            <div className="views">
              0 просмотров
            </div>
          </div>
          <div className="vide">
            <LazyLoad once className="poster">
              <img src={require('./images/vide-dev.svg').default} alt="" />
              <div className="overflow"></div>
            </LazyLoad>
            <div className="views">
              0 просмотров
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Vides;
