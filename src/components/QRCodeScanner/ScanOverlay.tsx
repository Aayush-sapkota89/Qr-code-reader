import React from 'react';

interface ScanOverlayProps {
  isScanning: boolean;
}

const ScanOverlay: React.FC<ScanOverlayProps> = ({ isScanning }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Semi-transparent overlay with transparent center */}
      <div className="absolute inset-0 bg-black bg-opacity-50">
        {/* Transparent scanning window */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 rounded-lg border-white border-opacity-70">
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br"></div>
          
          {/* Scanning laser effect */}
          {isScanning && (
            <div className="absolute left-0 right-0 h-0.5 bg-indigo-500 opacity-80 animate-scan">
              <div className="absolute inset-0 bg-indigo-300 blur-sm"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanOverlay;