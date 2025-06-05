import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import ScanResult from './ScanResult';
import ScanOverlay from './ScanOverlay';
import { AlertCircle, Camera } from 'lucide-react';

interface QRCodeScannerProps {
  className?: string;
}

type ScannerState = 'idle' | 'requesting' | 'scanning' | 'success' | 'error';

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ className = '' }) => {
  // State management
  const [scannerState, setScannerState] = useState<ScannerState>('idle');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Refs for DOM elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Function to handle QR code scanning
  const scanQRCode = useCallback(() => {
    if (scannerState !== 'scanning') return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the image data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    
    if (code) {
      // QR code found
      setScanResult(code.data);
      setScannerState('success');
      stopCamera();
    } else {
      // Continue scanning
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    }
  }, [scannerState]);

  // Start the camera and scanning process
  const startScanning = useCallback(async () => {
    try {
      setScannerState('requesting');
      setErrorMessage('');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScannerState('scanning');
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
      }
    } catch (error) {
      setScannerState('error');
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setErrorMessage('Camera access denied. Please allow camera access to scan QR codes.');
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        setErrorMessage('No camera found on your device.');
      } else {
        setErrorMessage('An error occurred while accessing the camera.');
        console.error('Camera error:', error);
      }
    }
  }, [scanQRCode]);

  // Stop the camera and clean up resources
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Reset the scanner to scan again
  const resetScanner = useCallback(() => {
    setScanResult(null);
    setScannerState('idle');
    setErrorMessage('');
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full relative overflow-hidden rounded-lg bg-black mb-4">
        {/* Video element for camera feed */}
        <div className="aspect-square relative">
          {(scannerState === 'scanning' || scannerState === 'requesting') && (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
              />
              <ScanOverlay isScanning={scannerState === 'scanning'} />
            </>
          )}
          
          {/* Idle state */}
          {scannerState === 'idle' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 p-6 text-center">
              <Camera size={48} className="text-indigo-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
              <p className="text-slate-300 mb-6">
                Position a QR code in front of your camera to scan it.
              </p>
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              >
                Start Camera
              </button>
            </div>
          )}
          
          {/* Error state */}
          {scannerState === 'error' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 p-6 text-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Camera Error</h2>
              <p className="text-slate-300 mb-6">{errorMessage}</p>
              <button
                onClick={resetScanner}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Success state */}
          {scannerState === 'success' && scanResult && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 p-6">
              <ScanResult
                result={scanResult}
                onScanAgain={resetScanner}
              />
            </div>
          )}
        </div>
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Instructions */}
      {scannerState === 'scanning' && (
        <p className="text-sm text-center text-slate-300 max-w-xs mx-auto">
          Center the QR code within the frame to scan
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;