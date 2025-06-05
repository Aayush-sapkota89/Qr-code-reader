import React from 'react';
import QRCodeScanner from './components/QRCodeScanner/QRCodeScanner';
import { Camera } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center px-4 py-8">
      <header className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Camera size={36} className="text-indigo-400 mr-2" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            QR Scanner
          </h1>
        </div>
        <p className="text-slate-300">
          Quickly scan QR codes using your device's camera
        </p>
      </header>
      
      <main className="w-full max-w-md flex-1 flex flex-col">
        <QRCodeScanner />
      </main>
      
      <footer className="mt-8 text-sm text-slate-400 text-center">
        <p>© {new Date().getFullYear()} QR Scanner App</p>
        <p className="text-xs mt-1">Privacy-focused: All scanning happens on your device</p>
      </footer>
    </div>
  );
}

export default App;