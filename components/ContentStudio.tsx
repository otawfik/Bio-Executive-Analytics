
import React, { useState, useRef } from 'react';
import { StudioImage } from '../types';
import { editStudioImage } from '../services/geminiService';

const ContentStudio: React.FC = () => {
  const [images, setImages] = useState<StudioImage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: StudioImage = {
          original: reader.result as string,
          prompt: '',
          loading: false
        };
        setImages([newImage, ...images]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (index: number) => {
    if (!currentPrompt.trim()) return;
    
    const updatedImages = [...images];
    updatedImages[index].loading = true;
    updatedImages[index].prompt = currentPrompt;
    setImages(updatedImages);

    try {
      const editedUrl = await editStudioImage(updatedImages[index].original, currentPrompt);
      const finishedImages = [...images];
      finishedImages[index].edited = editedUrl;
      finishedImages[index].loading = false;
      setImages(finishedImages);
      setCurrentPrompt('');
    } catch (err) {
      console.error("Editing failed", err);
      const failedImages = [...images];
      failedImages[index].loading = false;
      setImages(failedImages);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Performance Branding Studio</h2>
        <p className="text-zinc-400 mb-8 max-w-xl">
          Transform raw workout telemetry snapshots into premium athlete-grade marketing assets. Powered by Gemini 2.5 Flash Image.
        </p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*"
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Athlete Snapshot
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {images.map((img, idx) => (
          <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="p-4 border-r border-zinc-800">
              <span className="text-xs font-bold text-zinc-500 uppercase mb-3 block">Original Source</span>
              <img src={img.original} alt="Original" className="w-full h-[400px] object-cover rounded-xl border border-zinc-800" />
            </div>
            
            <div className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Nano-Banana Image Engine</span>
                  {img.loading && (
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                      <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      GENERATING ASSET...
                    </div>
                  )}
                </div>
                
                {img.edited ? (
                  <div className="space-y-4 animate-in zoom-in-95 duration-700">
                    <img src={img.edited} alt="Edited" className="w-full h-[300px] object-cover rounded-xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20" />
                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                      <p className="text-xs text-zinc-300">
                        <span className="text-indigo-400 font-bold">Applied:</span> {img.prompt}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.edited!;
                        link.download = 'athlete-branding.png';
                        link.click();
                      }}
                      className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all"
                    >
                      Download Marketing Asset
                    </button>
                  </div>
                ) : (
                  <div className="h-[300px] border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 bg-zinc-950/50">
                    <p className="text-sm">Enter instructions to begin AI transformation</p>
                  </div>
                )}
              </div>

              {!img.loading && !img.edited && (
                <div className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    placeholder="E.g., 'Add a cinematic retro filter', 'Clean background'"
                    className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                  />
                  <button 
                    onClick={() => handleEdit(idx)}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentStudio;
