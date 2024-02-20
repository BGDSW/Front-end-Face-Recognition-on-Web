import React from 'react';
import WebcamCapture from './WebcamCapture';
import WebcamCaptureMobile from './WebcamCaptureMobile'; // assuming you have created WebcamCaptureMobile component
import './App.css';

const App: React.FC = () => {
  const isMobile = useMobileDetection(); // Function to detect if the device is mobile

  return (
    <div className={isMobile ? 'AppMobile' : 'App'}>
      <header>
        <h1 className='title'>Webcam Face Recognition App</h1>
      </header>
      <main>
        {isMobile ? <WebcamCaptureMobile /> : <WebcamCapture />}
      </main>
    </div>
  );
};

export default App;

// Custom hook to detect if the device is mobile
function useMobileDetection() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    window.matchMedia('(max-width: 768px)').matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return isMobile;
}
