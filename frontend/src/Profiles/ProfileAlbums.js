import React, { Component } from 'react';
// import { Link } from 'react-router-dom'

class ProfileAlbums extends Component {

  render() {
    return (
      <>
        <div className="actions-albums">
          <div className="search">
            <input type="text" name="search" placeholder="Поиск" />
            <img src={require('../Main/images/search-input.svg').default} />
          </div>
          <div className="button">
            <img src={require('../Main/images/select.svg').default} />
          </div>
          <div className="button">
            <img src={require('../Main/images/add-album.svg').default} />
          </div>
        </div>
        <div className="albums">
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Публикации
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Избранное
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Сохранённое
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Скрытые
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Личное
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Архив
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Фото
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Видео
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Архив историй
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Актуальное
            </div>
          </div>
          <div className="album">
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="item">
              <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            </div>
            <div className="name">
              Недавно удалённые
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ProfileAlbums;
