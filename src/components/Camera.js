import React, { useEffect, useRef, useState } from "react";
//import "./style.scss";


export default function Camera() {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const stripRef = useRef(null);
    const [downloadLink, setDownloadLink] = useState('');
    const [cameraMode, setFlipCamera] = useState({facingMode : 'environment'});
    const [name, setName] = useState('')
    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: { cameraMode, width: 300 } })
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
  
      const width = 1130;
      const height = 840;
      photo.width = width;
      photo.height = height;
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
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
      setDownloadLink(data);
      const link = document.createElement("a");
      //link.href = data;
      link.setAttribute("download", name);
      link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
      strip.insertBefore(link, strip.firstChild);
    };
  
    const flipCamera = () => {

      var element = document.getElementById("player");
      if(cameraMode.facingMode === 'user') 
      {
        
        element.classList.add("player");
        setFlipCamera({facingMode : 'environment'})
        
      }
      else { 

        element.classList.remove("player");
        setFlipCamera({facingMode : 'user'})
      }
      console.log(cameraMode);
    }
    return (
      <div className="container">
      
        <div className="webcam-video">
          <div className="col-md-12">
          <video width="100%" heigth="300px" onCanPlay={() => paintToCanvas()} ref={videoRef} id="player" className="player text-center">
            <source src="path-to-video.mp4#t=0.001" type="video/mp4" />
          </video>
              {/* <video width="100%" heigth="300px"
              onCanPlay={() => paintToCanvas()}
              ref={videoRef}
              className="player"
              /> */}
              <hr/>
             
          <div className="col-md-6">
            <form>
              <div class="form-group">
                <label for="power">Power:</label>
                <input type="text" className="form-control" onChange={handleName} />  
              </div>
            </form>
          </div>
          <div className="col-md-6">
          <button onClick={() => flipCamera()} className="btn btn-info">Flip Camera</button>&nbsp;
          <button onClick={() => takePhoto()} className="btn btn-info">Take a photo</button>&nbsp;
          {
              downloadLink && name ?  <a href={downloadLink ?? '#'} className="btn btn-success" download={name}>Download</a> : <a className="btn btn-danger" disabled >Download</a>
            }
          </div>
          <hr/>
        </div>
          
          <div className="col-md-12 mt-4">
            <canvas style={{'display': 'none'}} id="canvas" ref={photoRef} className="photo" />
            <div className="photo-booth mt-5">
              <div ref={stripRef} className="strip" />
              </div>
            </div>
          </div>
      </div>
    );
}
