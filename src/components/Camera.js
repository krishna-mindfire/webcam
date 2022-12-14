import React, { useEffect, useRef, useState } from "react";
//import "./style.scss";


export default function Camera() {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const stripRef = useRef(null);
    const [downloadLink, setDownloadLink] = useState('');
    const [name, setName] = useState('')
    const [cameraMode, setFlipCamera] = useState({facingMode : 'environment'});
    const [isMobileDevice, setDevice] = useState(false)

    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    let isMobile = regexp.test(details);
    
    useEffect(() => {
      setDevice(isMobile);
      let element = document.getElementById("player");
      console.log(isMobileDevice);
     if (!isMobileDevice) {
        
        setFlipCamera({...cameraMode, ['facingMode'] : 'user' })
        
        element.classList.add("player");
      } 
      else{
        setDevice(true)
        element.classList.add("player");
      }
      console.log(cameraMode);

        navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraMode.facingMode, width: 300 } })
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
  
      // const width = 1130;
      // const height = 840;
      const width = videoRef.current.clientWidth;
      const height = videoRef.current.clientHeight;
      photo.width = width;
      photo.height = height;
      console.log(cameraMode.facingMode);
      if(isMobileDevice)
      {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      else if(cameraMode.facingMode != 'environment')
      {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      
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
    const flipCamera = (mode) => {
    
      //element.classList.remove("player");
      //setFlipCamera({...cameraMode, ['facingMode'] : 'user' })
      var element = document.getElementById("player");
      if(mode == 'user') 
      {
        element.classList.add("player");
        setFlipCamera({...cameraMode, ['facingMode'] : 'environment' })
      }
      else { 
        element.classList.remove("player");
        setFlipCamera({...cameraMode, ['facingMode'] : 'user' })
      }
      console.log(cameraMode);
      // console.log(cameraMode.facingMode);
    }
    return (
      <div className="container">
      
        <div className="webcam-video">
          <div className="col-md-12">
          <video style={{'width' : '100%', 'height':'auto'}} onCanPlay={() => paintToCanvas()} ref={videoRef} id="player" className="player text-center">
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
          {/* <button onClick={() => flipCamera(cameraMode.facingMode)} className="btn btn-info" disabled={!isMobileDevice}>Flip Camera</button>&nbsp; */}
          <button onClick={() => takePhoto()} className="btn btn-info">Take a photo</button>&nbsp;
          {
              downloadLink && name ?  <a href={downloadLink ?? '#'} className="btn bt n-success" download={name}>Download</a> : <a className="btn btn-danger" disabled >Download</a>
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
