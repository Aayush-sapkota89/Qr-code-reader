import React, { useState } from 'react';
import { Check, Copy, ExternalLink, QrCode, RotateCcw } from 'lucide-react';

interface ScanResultProps {
  result: string;
  onScanAgain: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ result, onScanAgain }) => {
  const [copied, setCopied] = useState(false);
  
  // Check if the result is a URL
  const isUrl = (() => {
    try {
      new URL(result);
      return true;
    } catch {
      return false;
    }
  })();
  
  // Copy the result to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  
  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4">
        <QrCode size={48} className="text-indigo-400" />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Scan Result</h2>
      
      <div className="w-full p-4 bg-slate-700 rounded-lg mb-6 overflow-hidden">
        <div className="max-h-36 overflow-auto">
          {isUrl ? (
            <a 
              href={result} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200 underline flex items-center break-all"
            >
              {result}
              <ExternalLink size={14} className="ml-1 inline flex-shrink-0" />
            </a>
          ) : (
            <p className="text-slate-200 break-all">{result}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex-1"
        >
          {copied ? (
            <>
              <Check size={18} className="mr-2 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={18} className="mr-2" />
              <span>Copy</span>
            </>
          )}
        </button>
        
        <button
          onClick={onScanAgain}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex-1"
        >
          <RotateCcw size={18} className="mr-2" />
          <span>Scan Again</span>
        </button>
      </div>
    </div>
  );
};

export default ScanResult;