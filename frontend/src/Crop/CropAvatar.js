import React, { useState, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'
import LastStep from './LastStep'
import './../App.css';

function CropAvatar({avatar, setAvatar, requestUser, setRequestUser}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(9 / 16)
  const [objectFit, setObjectFit] = useState("vertical-cover")

  const [image, setImage] = useState(avatar)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels
      )
      console.log(croppedImage)
      setCroppedImage({new: croppedImage[0], blob: croppedImage[1]});
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, croppedImage])

  const cancel = (e) => {
    setAvatar(null)
  }

  const next = (e) => {
    console.log(croppedImage)
    setRequestUser({ ...requestUser, ...{avatar: croppedImage.new, avatar_blob: croppedImage.blob} })
    setAvatar(null)
  }

  return (
    <>
    <div className="add-publication bottom changeAvatar">
      <div className="addHeader">
        <div className="cancel" onClick={cancel}>
          Отмена
        </div>
        <div className="text">
          Фото профиля
        </div>
        <div className="next" onClick={next}>
          Готово
        </div>
      </div>
      <div className="crop-container" style={{height: "70vh"}}>
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
          }}
        />
      </div>
    </div>
    </>
  )
}

export default CropAvatar;
