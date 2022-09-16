import React, { useEffect, useRef, useState } from "react";
//import "./style.scss";


export default function Camera() {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const stripRef = useRef(null);
    const [name, setName] = useState('')
    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: { width: 300 } })
        .then(stream => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch(err => {
          console.error("error:", err);
        });

    }, [videoRef]);
  
  
    const handleName = (e) => {
        setName(e.target.value);
    }
    const paintToCanvas = () => {
      let video = videoRef.current;
      let photo = photoRef.current;
      let ctx = photo.getContext("2d");
  
      const width = 800;
      const height = 640;
      photo.width = width;
      photo.height = height;
  
      return setInterval(() => {
       
        ctx.drawImage(video, 0, 0, width, height);
        ctx.getImageData(0, 0, width, height);
      }, 0);
    };
  
    const takePhoto = () => {
      let photo = photoRef.current;
      let strip = stripRef.current;
      strip.innerHTML = '';
      const data = photo.toDataURL("image/jpeg");
  
      console.warn(data);
      const link = document.createElement("a");
      link.href = data;
      link.setAttribute("download", name);
      link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
      strip.insertBefore(link, strip.firstChild);
    };
  
    return (
      <div className="container">
      
        <div className="webcam-video">
          <button onClick={() => takePhoto()}>Take a photo</button>
          <video
            onCanPlay={() => paintToCanvas()}
            ref={videoRef}
            className="player"
          />
          <input type="text" onChange={handleName} />
          <canvas style={{'display': 'none'}} ref={photoRef} className="photo" />
          <div className="photo-booth">
            <div ref={stripRef} className="strip" />
          </div>
        </div>
      </div>
    );
}
