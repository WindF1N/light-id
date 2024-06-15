import React, { useState, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'
import LastStep from './LastStep'
import './../App.css';

function Crop({files, setNext}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(1)
  const [aspectOld, setAspectOld] = useState(1)
  const [objectFit, setObjectFit] = useState(null)

  const [many, setMany] = useState(false)

  const [cropSize, setCropSize] = useState({width: "100vw", height: "100vw"})
  const [cropSizeOld, setCropSizeOld] = useState({width: 1, height: 1})

  const [image, setImage] = useState(files[0])

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const [croppedImages, setCroppedImages] = useState([])
  const [selectCount, setSelectCount] = useState(1)
  const [nextStep, setNextStep] = useState(false)

  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels
      )

      setCroppedImage(croppedImage)
      console.log(croppedImage)

      if (many){
        let new_images = [...croppedImages, {old: image, new: croppedImage[0], blob: croppedImage[1]}].reduce((acc, img) => {
          if (acc.map[img.old])
            return acc;
          acc.map[img.old] = true;
          acc.imgs.push(img);
          return acc;
        }, {
          map: {},
          imgs: []
        }).imgs;
        setCroppedImages(new_images);
      }else{
        setCroppedImages([{old: image, new: croppedImage[0], blob: croppedImage[1]}]);
      }

    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, croppedImages, many])

  const change = e => {
    let old = aspect;
    let old2 = aspectOld;

    setAspect(old2)
    setAspectOld(old)
    setZoom(1)

    if (objectFit === 'vertical-cover'){
      setObjectFit('horizontal-cover');
    }else{
      setObjectFit('vertical-cover');
    }
  }

  const select = e => {
    if (e.target.localName === 'img'){
      setImage(e.target.src);
      document.querySelectorAll(".all-files .file").forEach((item, i) => {
        item.classList.remove('active')
      });
      e.target.parentNode.classList.add('active');
      if (many){
        if (!e.target.parentNode.children[2].classList.contains('active')){
          e.target.parentNode.children[2].classList.add('active');
          e.target.parentNode.children[2].innerHTML = selectCount;
          setSelectCount(selectCount + 1)
        }
      }
    }
  }

  const changeSelect = e => {
    let old = aspect;
    let old2 = aspectOld;

    setCroppedImages([{old: image, new: croppedImage[0], blob: croppedImage[1]}]);

    if (many){
      setMany(false)
      setSelectCount(1)
      document.querySelectorAll('.all-files .file .select').forEach((item, i) => {
        item.classList.remove('active');
        item.innerHTML = null;
      });

    }else{
      setMany(true)
      document.querySelector('.all-files .file.active .select').classList.add('active');
      document.querySelector('.all-files .file.active .select').innerHTML = selectCount;
      setSelectCount(selectCount + 1)
    }
  }

  const next = e => {
    setNextStep(true)
  }

  const cancel = e => {
    setNext(false)
  }

  return (
    <>
    <div className="add-publication bottom">
      <div className="addHeader">
        <div className="cancel" onClick={cancel}>
          Отмена
        </div>
        <div className="text">
          Новая публикация
        </div>
        <div className="next" onClick={next}>
          Далее
        </div>
      </div>
      <div className="crop-container" style={{height: "100vw"}}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          objectFit={objectFit}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={(zoom) => {
            setZoom(zoom);
          }}
          onMediaLoaded={(mediaSize) => {
            setZoom(1);
            setAspectOld(1);
            if (mediaSize.width > mediaSize.height){
              if (!many){
                setObjectFit("horizontal-cover");
                setAspect(mediaSize.width / mediaSize.height);
              }
            }else if (mediaSize.width < mediaSize.height){
              if (!many){
                setObjectFit("vertical-cover");
                setAspect(4 / 5);
              }
            }
          }}
        />
        {many ? null :
          <div className="change" onClick={change}>
            <img src={require('../Main/images/change-addpost.svg').default} alt="" />
          </div>
        }
      </div>
      <div className="controls">
        <div className="name">
          Загруженные медия
        </div>
        <div className={many ? "changeSelect active" : "changeSelect"} onClick={changeSelect}>
          <img src={require('../Main/images/changeSelect.svg').default} alt=""/>
        </div>
      </div>
      <div className={many ? "all-files many" : "all-files"}>
        {files?.map((file, idx) =>
          <div className={file === image ? "file active" : "file"} onClick={select} data-id={idx} key={idx}>
            <img src={file} alt="" />
            <div className="overflow"></div>
            <div className="select"></div>
          </div>
        )}
      </div>
    </div>
    {nextStep ?
      <LastStep images={croppedImages} setNextStep={setNextStep} />
    : null}
    </>
  )
}

export default Crop;
