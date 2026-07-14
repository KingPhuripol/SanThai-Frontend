"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Camera, ScanLine, ShieldCheck, XCircle, CheckCircle, RefreshCcw } from "lucide-react";
import { fabricsApi } from "@/lib/api";

export default function FabricVerificationPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการเข้าถึงกล้องบนเบราว์เซอร์ของคุณ");
    }
  };

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Capture frame and send to API
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get Base64 image
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageBase64);
    
    // Stop camera and start scanning animation
    stopCamera();
    setIsScanning(true);
    
    try {
      // Call backend API
      const res = await fabricsApi.verifyFabric(imageBase64);
      setResult(res);
    } catch (err) {
      console.error("Verification failed:", err);
      setError("การตรวจสอบล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsScanning(false);
    }
  };

  const resetVerification = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setIsScanning(false);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-brand-900 text-white pt-24 pb-20 selection:bg-brand-300 selection:text-white">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 flex flex-col items-center justify-center min-h-[70vh]">
        
        <div className="w-full flex justify-start mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors" onClick={stopCamera}>
            <ChevronLeft size={20} />
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-400/20 text-gold-400 mb-6 border border-gold-400/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold thai-serif mb-4 text-gold-400 tracking-wide">ตรวจสอบประวัติผ้า</h1>
          <p className="text-white/70 max-w-md mx-auto leading-relaxed text-sm md:text-base">
            ระบบตรวจสอบที่มาของผ้าด้วยเทคโนโลยี AI Image Recognition และ Blockchain เพื่อยืนยันความถูกต้องและต้นกำเนิดของสินค้า
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 text-red-300 border border-red-500/50 p-4 rounded-xl flex items-center gap-3">
            <XCircle size={24} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="w-full max-w-md bg-brand-950/50 backdrop-blur-md border border-white/10 rounded-[32px] p-6 text-center relative overflow-hidden shadow-2xl">
          
          {/* Scanning Animation overlay */}
          {isScanning && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full absolute top-0 h-1 bg-gold-400 shadow-[0_0_20px_rgba(212,175,55,1)] animate-scan"></div>
              <ScanLine size={48} className="text-gold-400 animate-pulse mb-4" />
              <p className="text-gold-400 font-bold tracking-widest animate-pulse">กำลังวิเคราะห์เนื้อผ้าโดย AI...</p>
            </div>
          )}

          {/* Result Display */}
          {result && !isScanning && (
            <div className="absolute top-0 left-0 w-full h-full bg-brand-950 z-30 p-6 flex flex-col justify-start text-left overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-center mb-6 text-green-400 gap-2">
                <CheckCircle size={32} />
                <h2 className="text-xl font-bold">ยืนยันสินค้าสำเร็จ</h2>
              </div>
              
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border border-white/10">
                <img src={capturedImage!} alt="Captured fabric" className="w-full h-full object-cover" />
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-white/50 mb-1">ประเภทผ้า</p>
                  <p className="text-lg font-medium text-gold-300">{result.fabric_type}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">ลวดลาย</p>
                    <p className="text-sm font-medium">{result.pattern}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">สีหลัก</p>
                    <p className="text-sm font-medium">{result.colors?.join(', ') || '-'}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-white/50 mb-1">ความมั่นใจของ AI (AI Confidence)</p>
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-400" style={{ width: `${result.confidence_score}%` }}></div>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{result.confidence_score}%</p>
                </div>

                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Blockchain Tracking Hash (Mocked)</p>
                  <p className="text-xs font-mono text-white/40 break-all">{result.blockchain_hash}</p>
                </div>
              </div>

              <button 
                onClick={resetVerification}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 mt-auto"
              >
                <RefreshCcw size={18} />
                สแกนผ้าผืนอื่น
              </button>
            </div>
          )}

          {/* Camera View */}
          <div className="relative w-full aspect-[4/5] bg-black rounded-2xl overflow-hidden mb-6 border border-white/10 flex flex-col items-center justify-center">
            {isCameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              !capturedImage && (
                <div className="text-white/30 flex flex-col items-center">
                  <Camera size={48} className="mb-4 opacity-50" />
                  <p>กล้องปิดอยู่</p>
                </div>
              )
            )}
            
            {capturedImage && !isScanning && !result && (
              <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
            )}

            {/* Target Reticle */}
            {isCameraActive && (
              <div className="absolute inset-8 border-2 border-white/20 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                 <div className="w-8 h-8 border-t-4 border-l-4 border-gold-400 rounded-tl-xl"></div>
                 <div className="w-8 h-8 border-b-4 border-l-4 border-gold-400 rounded-bl-xl absolute bottom-4 left-4"></div>
                 <div className="w-8 h-8 border-t-4 border-r-4 border-gold-400 rounded-tr-xl absolute top-4 right-4"></div>
                 <div className="w-8 h-8 border-b-4 border-r-4 border-gold-400 rounded-br-xl absolute bottom-4 right-4"></div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="space-y-4">
            {!isCameraActive && !capturedImage ? (
              <button 
                onClick={startCamera}
                className="w-full py-4 bg-gradient-to-r from-gold-300 to-gold-500 text-brand-950 font-bold rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                เปิดกล้องเพื่อตรวจสอบ
              </button>
            ) : (
              <button 
                onClick={handleCapture}
                disabled={isScanning}
                className={`w-full py-4 ${isScanning ? 'bg-white/20' : 'bg-gold-400 hover:bg-gold-300'} text-brand-950 font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2`}
              >
                <ScanLine size={20} />
                {isScanning ? "กำลังประมวลผล..." : "ถ่ายภาพเพื่อวิเคราะห์"}
              </button>
            )}
            <p className="text-xs text-white/40">นำกล้องจ่อที่เนื้อผ้าให้เห็นลวดลายชัดเจน เพื่อความแม่นยำของ AI</p>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
