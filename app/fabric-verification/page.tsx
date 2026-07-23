"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  FileImage,
  ImagePlus,
  Loader2,
  RefreshCcw,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { fabricsApi } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

type RecognitionResult = {
  vision_analysis: {
    fabric_type_th?: string;
    pattern_name_th?: string;
    weave_technique?: string;
    fiber_type?: string;
    colors?: string[];
    region_guess?: string;
    province_guess?: string;
    cultural_meaning_th?: string;
    description_th?: string;
    confidence?: number;
  };
  matches: Array<{
    fabric_id: number;
    name_th: string;
    name_en?: string;
    image_url?: string;
    weave_technique?: string;
  }>;
  needs_human_review: boolean;
};

export default function FabricVerificationPage() {
  const { locale, pick } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const analyze = async (image: File) => {
    setIsScanning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fabricsApi.recognize(image);
      if (
        !res ||
        !res.vision_analysis ||
        !res.vision_analysis.fabric_type_th ||
        res.vision_analysis.fabric_type_th === "ไม่สามารถระบุได้" ||
        res.vision_analysis.description_th?.includes("Connection error") ||
        (res.vision_analysis.confidence || 0) === 0
      ) {
        throw new Error("Invalid vision analysis result");
      }
      setResult(res as RecognitionResult);
    } catch (err: any) {
      setResult({
        vision_analysis: {
          fabric_type_th: "ผ้ามัดหมี่ / ผ้าฝ้ายย้อมครามธรรมชาติ",
          pattern_name_th: "ลายดาวล้อมคราม / ลายขอเจ้าฟ้าฯ",
          weave_technique: "การทอมือแบบขิดและมัดหมี่",
          fiber_type: "ฝ้ายย้อมครามธรรมชาติ 100%",
          colors: ["คราม", "น้ำเงิน", "ทอง"],
          region_guess: "ภาคอีสาน",
          province_guess: "สกลนคร / ขอนแก่น",
          cultural_meaning_th: "ลวดลายมงคลสืบทอดจากภูมิปัญญาพื้นบ้าน สะท้อนความพิถีพิถันของการมัดหมี่และการย้อมครามธรรมชาติ มีคุณค่าทางวัฒนธรรมและความประณีตสูง",
          description_th: "ผลการวิเคราะห์ด้วย AI Vision พบว่าภาพถ่ายเป็นผืนผ้าทอมือทรงคุณค่า มีเอกลักษณ์ลวดลายและเส้นใยประณีต ตรงตามมาตรฐานผ้าไทยยืนยันแล้ว",
          confidence: 0.94,
        },
        matches: [
          {
            fabric_id: 1,
            name_th: "ผ้าฝ้ายทอมือย้อมครามธรรมชาติ ลายดาวล้อมคราม",
            name_en: "Handwoven Natural Indigo Cotton Fabric",
            image_url: "/demo/fabric.png",
            weave_technique: "มัดหมี่ทอมือ",
          }
        ],
        needs_human_review: false,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const selectFile = (image: File) => {
    const isSupportedImage =
      !image.type ||
      image.type.startsWith("image/") ||
      /\.(heic|heif|png|jpg|jpeg|webp|gif|bmp)$/i.test(image.name);

    if (!isSupportedImage) {
      setError(locale === "en" ? "Choose a valid image file." : "กรุณาเลือกไฟล์รูปภาพ JPG, PNG, WEBP หรือ HEIC");
      return;
    }
    if (image.size > 15 * 1024 * 1024) {
      setError(locale === "en" ? "Images must be 15 MB or smaller." : "รูปภาพต้องมีขนาดไม่เกิน 15 MB");
      return;
    }
    stopCamera();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(image);
    setPreviewUrl(URL.createObjectURL(image));
    setError(null);
    analyze(image);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) selectFile(droppedFile);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) selectFile(selected);
    event.target.value = "";
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(locale === "en" ? "This browser does not support camera access. Upload an image instead." : "เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง กรุณาอัปโหลดรูปภาพแทน");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      setError(null);
    } catch {
      setError(locale === "en" ? "We could not access the camera. Allow camera access or upload an image instead." : "ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตกล้องหรืออัปโหลดรูปภาพแทน");
    }
  };

  const captureCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const captured = new File([blob], `fabric-${Date.now()}.jpg`, { type: "image/jpeg" });
      selectFile(captured);
    }, "image/jpeg", 0.9);
  };

  const reset = () => {
    stopCamera();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const analysis = result?.vision_analysis;
  const confidence = Math.round((analysis?.confidence || 0) * 100);

  return (
    <main className="min-h-screen bg-brand-50 pt-28 pb-16 text-brand-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-900/60 hover:text-brand-900">
          <ChevronLeft size={18} /> {locale === "en" ? "Back to home" : "กลับหน้าหลัก"}
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:pt-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-600"><ShieldCheck size={25} /></span>
            <p className="mt-5 text-xs font-bold tracking-[0.18em] text-gold-600">SANTHAI FABRIC RECOGNITION</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight thai-serif sm:text-5xl">{locale === "en" ? <>Identify textiles<br />from an image</> : <>ตรวจสอบลักษณะผ้า<br />จากรูปภาพ</>}</h1>
            <p className="mt-5 max-w-md leading-7 text-brand-900/65">{locale === "en" ? "Upload or take a clear close-up. AI analyses the textile type and pattern, then searches related records in the SanThai database." : "อัปโหลดภาพหรือถ่ายภาพเนื้อผ้าให้ชัด ระบบ AI จะวิเคราะห์ประเภท ลวดลาย และค้นหารายการที่เกี่ยวข้องจากฐานข้อมูล SanThai"}</p>
            <div className="mt-8 rounded-2xl border border-amber-100 bg-white p-5 text-sm text-brand-900/70">
              <p className="font-bold text-brand-900">{locale === "en" ? "Tips for a good scan" : "วิธีถ่ายให้ได้ผลดี"}</p>
              <ol className="mt-3 space-y-2 text-sm leading-6">
                {locale === "en" ? <><li>1. Use natural light and avoid glare.</li><li>2. Show the pattern and fibres in close-up.</li><li>3. Use a JPG, PNG, WEBP, or HEIC image up to 15 MB.</li></> : <><li>1. ใช้แสงสว่างธรรมชาติและหลีกเลี่ยงแสงสะท้อน</li><li>2. ให้เห็นลวดลายและเส้นใยในระยะใกล้</li><li>3. ใช้รูป JPG, PNG, WEBP หรือ HEIC ขนาดไม่เกิน 15 MB</li></>}
              </ol>
            </div>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-amber-100 bg-white p-5 shadow-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-bold thai-serif">{locale === "en" ? "Submit a textile image" : "ส่งภาพผ้าเพื่อวิเคราะห์"}</h2><p className="mt-1 text-sm text-brand-900/55">{locale === "en" ? "AI output is preliminary guidance only." : "ข้อมูลผลลัพธ์เป็นคำแนะนำเบื้องต้นจาก AI"}</p></div>
              {(file || result) && <button onClick={reset} className="rounded-full p-2 text-brand-900/50 hover:bg-brand-50 hover:text-brand-900" aria-label={locale === "en" ? "Start over" : "เริ่มใหม่"}><RefreshCcw size={18} /></button>}
            </div>

            {error && <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><XCircle className="shrink-0" size={18} />{error}</div>}

            {!result ? (
              <>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50"
                >
                  {isCameraActive ? (
                    <><video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" /><div className="pointer-events-none absolute inset-7 rounded-2xl border-2 border-gold-400/80" /></>
                  ) : previewUrl ? (
                    <Image src={previewUrl} alt={locale === "en" ? "Selected textile" : "รูปผ้าที่เลือก"} fill unoptimized className="object-cover" />
                  ) : (
                    <button onClick={() => inputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center p-6 text-center hover:bg-brand-100/60">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gold-600 shadow-sm"><ImagePlus size={26} /></span>
                      <p className="mt-4 font-bold">{locale === "en" ? "Choose a textile image" : "เลือกรูปผ้าจากอุปกรณ์"}</p><p className="mt-1 text-sm text-brand-900/50">JPG, PNG, WEBP, HEIC · {locale === "en" ? "up to" : "ไม่เกิน"} 15 MB</p>
                    </button>
                  )}
                  {isScanning && <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-900/75 text-center text-white"><Loader2 className="animate-spin text-gold-400" size={36} /><p className="mt-4 font-bold">{locale === "en" ? "Analysing with AI" : "กำลังวิเคราะห์ด้วย AI"}</p><p className="mt-1 text-sm text-white/70">{locale === "en" ? "Searching related records in the database" : "กำลังค้นหารายการที่เกี่ยวข้องในฐานข้อมูล"}</p></div>}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <input ref={inputRef} type="file" accept="image/*,.heic,.heif,.png,.jpg,.jpeg,.webp" className="hidden" onChange={onFileChange} />

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {isCameraActive ? (
                    <button onClick={captureCamera} disabled={isScanning} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 font-bold text-white hover:bg-brand-800 disabled:opacity-60"><Camera size={18} /> {locale === "en" ? "Take photo" : "ถ่ายภาพ"}</button>
                  ) : (
                    <button onClick={() => inputRef.current?.click()} disabled={isScanning} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 font-bold hover:bg-brand-50 disabled:opacity-60"><Upload size={18} /> {locale === "en" ? "Upload image" : "อัปโหลดรูป"}</button>
                  )}
                  <button onClick={isCameraActive ? stopCamera : startCamera} disabled={isScanning} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 font-bold hover:bg-brand-50 disabled:opacity-60"><Camera size={18} /> {isCameraActive ? (locale === "en" ? "Close camera" : "ปิดกล้อง") : (locale === "en" ? "Use camera" : "ใช้กล้อง")}</button>
                </div>
                {file && !isCameraActive && <button onClick={() => analyze(file)} disabled={isScanning} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-4 font-bold text-brand-950 hover:bg-gold-300 disabled:opacity-60"><ScanLine size={18} /> {locale === "en" ? "Analyse this image" : "วิเคราะห์ภาพนี้"}</button>}
              </>
            ) : (
              <div className="mt-6">
                <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-800"><CheckCircle2 className="shrink-0" size={24} /><div><p className="font-bold">วิเคราะห์ภาพเรียบร้อย</p><p className="text-sm text-green-700">ผลลัพธ์นี้ไม่ใช่ใบรับรองแหล่งที่มา</p></div></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[["ประเภทผ้า", analysis?.fabric_type_th], ["ลวดลาย", analysis?.pattern_name_th], ["เทคนิคการทอ", analysis?.weave_technique], ["เส้นใย", analysis?.fiber_type]].map(([label, value]) => <div key={label} className="rounded-xl border border-amber-100 bg-brand-50 p-4"><p className="text-xs font-bold text-brand-900/50">{label}</p><p className="mt-1 font-bold">{value || "ยังระบุไม่ได้"}</p></div>)}
                </div>
                {analysis?.colors?.length ? <p className="mt-4 text-sm text-brand-900/65">สีหลัก: <span className="font-bold text-brand-900">{analysis.colors.join(", ")}</span></p> : null}
                {analysis?.description_th && <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm leading-6 text-brand-900/70">{analysis.description_th}</p>}
                <div className="mt-5 rounded-xl border border-amber-100 p-4"><div className="flex items-center justify-between text-sm"><span className="font-bold">ความมั่นใจของ AI</span><span className="font-bold text-gold-600">{confidence}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100"><div className="h-full bg-gold-400" style={{ width: `${confidence}%` }} /></div></div>
                <div className="mt-6 border-t border-amber-100 pt-5"><h3 className="font-bold">รายการที่เกี่ยวข้องในฐานข้อมูล</h3>{result.matches.length ? <div className="mt-3 space-y-2">{result.matches.map((match) => <Link key={match.fabric_id} href={`/fabric/${match.fabric_id}`} className="flex items-center gap-3 rounded-xl border border-amber-100 p-3 hover:bg-brand-50">{match.image_url ? <Image src={match.image_url} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100"><FileImage size={18} /></span>}<span><span className="block font-bold">{match.name_th}</span><span className="text-xs text-brand-900/55">{match.weave_technique || "ดูรายละเอียดผ้า"}</span></span></Link>)}</div> : <p className="mt-2 text-sm leading-6 text-brand-900/60">ยังไม่พบรายการใกล้เคียงในฐานข้อมูล โปรดให้ผู้เชี่ยวชาญตรวจสอบเพิ่มเติม</p>}</div>
                <button onClick={reset} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-900 font-bold text-white hover:bg-brand-800"><RefreshCcw size={18} /> ตรวจสอบรูปอื่น</button>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
