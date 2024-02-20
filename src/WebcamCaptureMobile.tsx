import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './WebcamCaptureMobile.css'
import * as faceapi from 'face-api.js'


const WebcamCaptureMobile: React.FC = () => {
  const placeholderImage = require('./resources/NoCamera.jpg');
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState(placeholderImage);

  const [width, setWidth] = useState(640);
  const [height, setHeigh] = useState(480);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));


  let optionsTinyFaceDetector: faceapi.SsdMobilenetv1Options | faceapi.MtcnnOptions | faceapi.TinyYolov2Options | undefined;

  const loadModels = async () => {
    try{
      await faceapi.nets.ssdMobilenetv1.load('/models/ssd_mobilenetv1_model-weights_manifest.json');
      await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json');
      await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json');
      await faceapi.nets.faceExpressionNet.load('/models/face_expression_model-weights_manifest.json');
      optionsTinyFaceDetector = new faceapi.TinyFaceDetectorOptions();
      console.log('Models load successfully.');
    }catch (error) {
      console.log('Models did not load successfully. Refresh the page.');
    }
  };


  useEffect(() => {
    loadModels();
  }, []);

  const startCam = () => {
    setIsCapturing(true);
    setImageSrc(placeholderImage); // Clear the image source when starting capturing
  };

  const stopCam = () => {
    setIsCapturing(false);
    setImageSrc(placeholderImage); // Set the webcam image or placeholder image when stopping capturing
  };

  const detectFace = async (img: any) => {
    const input = new Image();
    input.src = img;
    const detections = await faceapi.detectAllFaces(input, optionsTinyFaceDetector).withFaceLandmarks().withFaceExpressions();
    const canvas = canvasRef.current;
    const displaySize = { width, height };
    faceapi.matchDimensions(canvas, displaySize);
    
    for (const detection of detections) {
      const resizedDetections = faceapi.resizeResults(detection, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }
  }

  const capture = () => {
    const newImageSrc = webcamRef.current?.getScreenshot();
    if (newImageSrc) {
      setProcessedImageSrc(newImageSrc);
      detectFace(newImageSrc);
      // Do something with the captured imageSrc, like displaying it in an <img> tag or sending it to a server
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessedImageSrc(reader.result);
        detectFace(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };




  const videoConstraints = isCapturing ? { facingMode: 'user' } : false;

  return (
    <>
      {isCapturing ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam-videoMobile"
        />
      ) : (
        <img className='PlaceholderMobile' src={imageSrc || placeholderImage} alt="Placeholder" />
      )}
      {isCapturing ? (
        <button className='CamButton1Mobile' onClick={stopCam}>Stop Webcam</button>
      ) : (
        <button className='CamButton2Mobile' onClick={startCam}>Start Webcam</button>
      )}
      {isCapturing && <button className='CapButtonMobile' onClick={capture}>Capture</button>}
      {<img className='ProcessedImageMobile' src={processedImageSrc} alt="processedImage"/>}
      <canvas className='CanvasMobile' ref={canvasRef} width={width} height={height}></canvas>
      <input className='UploadImgMobile' type="file" accept="image/*" onChange={handleFileInputChange} />
    </>
  );
};

export default WebcamCaptureMobile;