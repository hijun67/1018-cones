import React, { useState, useRef, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { calculateSaju, getZodiacIdByBirthYear, getConstellationIdByBirthDate, ELEMENT_INFO } from '../utils/sajuCalculator';
import { SAMPLE_TODAY_FORTUNE, ZODIAC_SIGNS, CONSTELLATIONS, TAROT_CARDS, FORTUNE_COOKIES, TALISMAN_TEMPLATES } from '../data/fortuneData';
import { FiveElement } from '../types/fortune';
import { 
  X, Download, Printer, FileText, CheckCircle2, 
  Loader2, Award, ExternalLink, Sparkles, Clock, Dices, Eye, Cookie, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import * as htmlToImage from 'html-to-image';

export const ReportPdfModal: React.FC = () => {
  const {
    isReportModalOpen,
    closeReportModal,
    profiles,
    activeProfileId,
    setActiveProfileId,
  } = useUser();

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<{ url: string; filename: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Explicit distinct refs for Page 1 and Page 2 (Guarantees NO slicing in the middle of boxes!)
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  // Selected profile for report (defaults to activeProfile or first profile)
  const currentProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || (profiles.length > 0 ? profiles[0] : null);
  }, [profiles, activeProfileId]);

  // Saju calculation for current profile
  const sajuData = useMemo(() => {
    const year = currentProfile?.birthYear ?? 1995;
    const month = currentProfile?.birthMonth ?? 7;
    const day = currentProfile?.birthDay ?? 7;
    const hour = currentProfile?.isUnknownHour ? 12 : (currentProfile?.birthHour ?? 12);
    const gender = currentProfile?.gender ?? 'male';
    const calendarType = currentProfile?.calendarType ?? 'solar';

    return calculateSaju(year, month, day, hour, gender, calendarType);
  }, [currentProfile]);

  // Zodiac & Constellation info
  const zodiacInfo = useMemo(() => {
    const year = currentProfile?.birthYear ?? 1995;
    const zId = getZodiacIdByBirthYear(year);
    return ZODIAC_SIGNS.find((z) => z.id === zId) || ZODIAC_SIGNS[0];
  }, [currentProfile]);

  const constellationInfo = useMemo(() => {
    const month = currentProfile?.birthMonth ?? 7;
    const day = currentProfile?.birthDay ?? 7;
    const cId = getConstellationIdByBirthDate(month, day);
    return CONSTELLATIONS.find((c) => c.id === cId) || CONSTELLATIONS[0];
  }, [currentProfile]);

  // Deterministic 6 Lucky Lotto Numbers based on user and today's date
  const today = useMemo(() => new Date(), []);
  const formattedToday = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const reportCertId = `UNSU-2026-${Math.abs((today.getTime() % 899999) + 100000)}`;

  const lottoNumbers = useMemo(() => {
    const seed = (currentProfile?.birthYear ?? 1995) * 10000 + 
                 (currentProfile?.birthMonth ?? 7) * 100 + 
                 (currentProfile?.birthDay ?? 7) + 
                 today.getDate() * 11 + 
                 (today.getMonth() + 1) * 37;
    const numbers: number[] = [];
    let s = Math.abs(seed);
    while (numbers.length < 6) {
      s = (s * 9301 + 49297) % 233280;
      const num = (s % 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  }, [currentProfile, today]);

  // Recommended Tarot Card
  const recommendedTarot = useMemo(() => {
    const idx = Math.abs((currentProfile?.birthDay ?? 7) + today.getDate()) % TAROT_CARDS.length;
    return TAROT_CARDS[idx] || TAROT_CARDS[3];
  }, [currentProfile, today]);

  // Recommended Fortune Cookie
  const recommendedCookie = useMemo(() => {
    const idx = Math.abs((currentProfile?.birthMonth ?? 7) + today.getDay()) % FORTUNE_COOKIES.length;
    return FORTUNE_COOKIES[idx] || FORTUNE_COOKIES[2];
  }, [currentProfile, today]);

  // Recommended Talisman
  const recommendedTalisman = useMemo(() => {
    return TALISMAN_TEMPLATES[0]; // 만사형통 재물대길부
  }, []);

  // 6. 정통사주 100자 이내 요약
  const sajuSummary100 = useMemo(() => {
    const text = `${currentProfile?.name || '귀하'}님은 ${sajuData.dayMaster.stem}(${sajuData.dayMaster.element}) 일주로 직관력과 추진력이 남다릅니다. ${sajuData.dominantElement} 기운이 강하여 ${sajuData.lackingElement} 기운을 보완하고 행운 색상(${sajuData.remedyColor})을 일상에 곁들이면 재물과 번영이 크게 길합니다.`;
    return text.length > 98 ? text.slice(0, 97) + '...' : text;
  }, [currentProfile, sajuData]);

  // 7. 띠별, 별자리 100자 이내 요약
  const zodiacSummary100 = useMemo(() => {
    const text = `${zodiacInfo.name}의 올해 기운은 귀인과의 협력과 문서운이 대길하며, ${constellationInfo.name}의 수호 에너지가 직관력과 재능을 극대화합니다. 주변과의 상생을 바탕으로 소신껏 전진하시면 승운이 따릅니다.`;
    return text.length > 98 ? text.slice(0, 97) + '...' : text;
  }, [zodiacInfo, constellationInfo]);

  if (!isReportModalOpen) return null;

  // Capture a single page cleanly into image data
  const capturePageImage = async (element: HTMLElement): Promise<string> => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });
      return canvas.toDataURL('image/jpeg', 0.96);
    } catch (proErr) {
      console.warn('html2canvas error, falling back to htmlToImage:', proErr);
      return await htmlToImage.toJpeg(element, {
        quality: 0.96,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });
    }
  };

  // Handle PDF Generation: Captures Page 1 and Page 2 distinctly so NO horizontal slicing occurs!
  const handleDownloadPdf = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    setIsGenerating(true);
    setErrorMessage('');
    setDownloadProgress('1페이지 (사주원국·오늘운세·시간대흐름·로또) 렌더링 중...');

    try {
      // 1. Capture Page 1
      const page1ImgData = await capturePageImage(page1Ref.current);

      setDownloadProgress('2페이지 (100자요약·타로·포춘쿠키·행운부적) 렌더링 중...');

      // 2. Capture Page 2
      const page2ImgData = await capturePageImage(page2Ref.current);

      setDownloadProgress('A4 2페이지 규격 PDF 파일 생성 중...');

      // Initialize jsPDF A4 (210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Add Page 1
      pdf.addImage(page1ImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      // Add Page 2
      pdf.addPage();
      pdf.addImage(page2ImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const safeName = (currentProfile?.name || '사용자').replace(/[^a-zA-Z0-9가-힣]/g, '_');
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `운수(UNSU)_정통사주_종합리포트_${safeName}_${dateStr}.pdf`;

      // Create PDF Blob and Object URL
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Save download link to state
      setDownloadLink({ url: blobUrl, filename });
      setDownloadProgress('PDF 다운로드 준비 완료!');

      // Attempt automatic download
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = filename;
      downloadAnchor.style.display = 'none';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      setTimeout(() => {
        if (document.body.contains(downloadAnchor)) {
          document.body.removeChild(downloadAnchor);
        }
      }, 600);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6'],
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      setErrorMessage('PDF 생성 중 일시적인 지연이 발생했습니다. [인쇄 / PDF 저장] 기능을 이용하시거나 다시 다운로드를 눌러주세요.');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 600);
    }
  };

  // Direct Browser Print without popup blocker (with explicit A4 page breaks)
  const handlePrint = () => {
    if (!page1Ref.current || !page2Ref.current) return;
    const page1Content = page1Ref.current.innerHTML;
    const page2Content = page2Ref.current.innerHTML;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>운수(UNSU)_정통사주_종합리포트</title>
            <style>
              @page { size: A4 portrait; margin: 8mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 0; }
              * { box-sizing: border-box; }
              .pdf-page-container { page-break-after: always; break-after: page; min-height: 280mm; padding: 4mm; display: flex; flex-direction: column; justify-content: space-between; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
              th, td { border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 11px; }
              h1 { font-size: 18px; margin: 0 0 4px 0; }
              h2 { font-size: 13px; margin: 10px 0 6px 0; border-left: 4px solid #d97706; padding-left: 6px; }
            </style>
          </head>
          <body>
            <div class="pdf-page-container">${page1Content}</div>
            <div class="pdf-page-container" style="page-break-after: avoid; break-after: avoid;">${page2Content}</div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }, 300);
    }
  };

  const getElementColorClass = (el: FiveElement) => {
    switch (el) {
      case '목': return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case '화': return 'bg-red-50 text-red-900 border-red-300';
      case '토': return 'bg-amber-50 text-amber-900 border-amber-300';
      case '금': return 'bg-slate-100 text-slate-900 border-slate-300';
      case '수': return 'bg-blue-50 text-blue-900 border-blue-300';
      default: return 'bg-slate-50 text-slate-900 border-slate-200';
    }
  };

  const getLottoBallStyle = (num: number) => {
    if (num <= 10) return { bg: '#f59e0b', border: '#d97706' }; // Yellow/Gold
    if (num <= 20) return { bg: '#3b82f6', border: '#2563eb' }; // Blue
    if (num <= 30) return { bg: '#ef4444', border: '#dc2626' }; // Red
    if (num <= 40) return { bg: '#64748b', border: '#475569' }; // Slate
    return { bg: '#10b981', border: '#059669' }; // Green
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col rounded-3xl bg-slate-900 border border-amber-500/50 shadow-2xl text-white overflow-hidden">
        
        {/* Top Header & Actions Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif-kr flex items-center gap-2">
                <span>정통 사주 & 종합 운세 10대 리포트</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                  A4 2페이지 완결본
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                원국표, 오늘의 운세, 시간대별 기운, 로또번호, 100자 요약, 타로, 포춘쿠키, 행운부적까지 10개 전 항목이 포함됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Subject Selector if multiple profiles exist */}
            {profiles.length > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                <span className="text-slate-400">대상:</span>
                <select
                  value={currentProfile?.id}
                  onChange={(e) => setActiveProfileId(e.target.value)}
                  className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name || '본인'} ({p.relationship || '지인'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="브라우저 인쇄창을 통해 PDF로 저장하거나 출력"
            >
              <Printer className="w-4 h-4" />
              <span>인쇄 / PDF 저장</span>
            </button>

            {/* PDF Direct Download Button */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPdf}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{downloadProgress || 'PDF 생성 중...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>PDF 파일로 다운로드</span>
                </>
              )}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={closeReportModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70 flex flex-col items-center gap-6">
          
          {/* Direct Download Link Card (Appears whenever PDF is ready) */}
          {downloadLink && (
            <div className="w-full max-w-[760px] p-4 rounded-2xl bg-emerald-950/85 border-2 border-emerald-400 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-200">
                    10대 전 항목이 포함된 2페이지 규격 PDF가 성공적으로 완성되었습니다!
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    자동 다운로드가 시작되지 않았다면 아래 버튼을 눌러 즉시 저장하세요.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={downloadLink.url}
                  download={downloadLink.filename}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>📥 지금 다운로드 ({downloadLink.filename})</span>
                </a>
                <a
                  href={downloadLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                  title="새 탭에서 열기"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Error Message Notice if any */}
          {errorMessage && (
            <div className="w-full max-w-[760px] p-3.5 rounded-2xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shrink-0"
              >
                인쇄창 열기
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 1: A4 1페이지 (1.사주원국표 ~ 5.추천 로또번호) */}
          {/* ============================================================== */}
          <div className="w-full max-w-[760px] flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 px-1 text-xs text-amber-400 font-bold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF 1페이지 (1.사주원국표 · 2.오행 · 3.오늘의운세 · 4.시간대별기운 · 5.추천로또번호)</span>
              </span>
              <span className="text-slate-400">A4 210 × 297mm 규격</span>
            </div>

            <div
              ref={page1Ref}
              className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-200 font-sans flex flex-col justify-between"
              style={{ width: '760px', minHeight: '1075px', backgroundColor: '#ffffff', color: '#0f172a' }}
            >
              <div>
                {/* 1. Header & Official Seal */}
                <div className="border-b-2 pb-3 mb-3" style={{ borderColor: '#d97706' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="px-2.5 py-0.5 rounded font-black text-[11px] tracking-wider border"
                          style={{ backgroundColor: '#fef3c7', color: '#78350f', borderColor: '#fcd34d' }}
                        >
                          運數 (UNSU) 2026 OFFICIAL REPORT
                        </span>
                        <span className="text-[11px] text-slate-500">인증번호: {reportCertId}</span>
                      </div>
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight font-serif-kr">
                        정통 사주팔자 & 일일 운세 종합 감명서
                      </h1>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        본 감명서는 전통 명리학의 자평진전(子平眞詮)과 적천수(滴天髓) 원리에 입각하여 정밀 산출되었습니다.
                      </p>
                    </div>

                    {/* Korean Traditional Red Official Seal */}
                    <div 
                      className="w-14 h-14 rounded-2xl border-4 flex flex-col items-center justify-center shadow-sm shrink-0 font-serif-kr select-none"
                      style={{ borderColor: '#b91c1c', backgroundColor: '#fef2f2', color: '#b91c1c' }}
                    >
                      <span className="text-[8px] font-bold leading-tight">대한민국</span>
                      <span className="text-sm font-black leading-tight">運數印</span>
                      <span className="text-[7px] font-bold leading-tight">정통명리</span>
                    </div>
                  </div>

                  {/* Target Profile Metadata Summary Table */}
                  <div 
                    className="grid grid-cols-4 gap-2 mt-2.5 p-2.5 rounded-xl border text-xs"
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  >
                    <div>
                      <span className="text-slate-500 block text-[10px]">감명 대상자</span>
                      <span className="font-bold text-slate-900 text-xs">
                        {currentProfile?.name || '본인'} ({currentProfile?.gender === 'male' ? '남성' : '여성'})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">생년월일(출생시)</span>
                      <span className="font-bold text-slate-900 text-xs">
                        {currentProfile?.birthYear ?? 1995}년 {currentProfile?.birthMonth ?? 7}월 {currentProfile?.birthDay ?? 7}일
                        <span className="text-slate-500 text-[10px] ml-1">({currentProfile?.calendarType === 'lunar' ? '음력' : '양력'})</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">12간지 띠 & 별자리</span>
                      <span className="font-bold text-amber-800 text-xs">
                        {zodiacInfo.symbol} {zodiacInfo.name} · {constellationInfo.symbol} {constellationInfo.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">발급 일자</span>
                      <span className="font-bold text-slate-900 text-xs">{formattedToday}</span>
                    </div>
                  </div>
                </div>

                {/* 1. 사주팔자(四柱八字) 원국표(原局表) & 천간지지 */}
                <div className="mb-3.5">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <span>1. 사주팔자(四柱八字) 원국표(原局表) & 천간지지</span>
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse border border-slate-300 text-xs">
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                          <th className="border border-slate-300 py-1 w-1/5">구분</th>
                          <th className="border border-slate-300 py-1 w-1/5">시주(時柱)</th>
                          <th className="border border-slate-300 py-1 w-1/5 font-bold" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
                            일주(日柱 · 본원)
                          </th>
                          <th className="border border-slate-300 py-1 w-1/5">월주(月柱)</th>
                          <th className="border border-slate-300 py-1 w-1/5">년주(年柱)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 천간 (Heavenly Stems) */}
                        <tr>
                          <td className="border border-slate-300 py-1 font-bold" style={{ backgroundColor: '#f8fafc', color: '#334155' }}>
                            천간(天干)
                          </td>
                          <td className="border border-slate-300 py-1">
                            <span className="text-base font-black text-slate-900 font-serif-kr">{sajuData.fourPillars.hour.stemHanja}</span>
                            <span className="text-[10px] text-slate-600 block">{sajuData.fourPillars.hour.stem} ({sajuData.fourPillars.hour.stemElement})</span>
                          </td>
                          <td className="border border-slate-300 py-1 font-black" style={{ backgroundColor: '#fffbeb' }}>
                            <span className="text-lg font-black font-serif-kr" style={{ color: '#78350f' }}>{sajuData.fourPillars.day.stemHanja}</span>
                            <span className="text-[10px] block font-bold" style={{ color: '#92400e' }}>
                              {sajuData.fourPillars.day.stem} ({sajuData.fourPillars.day.stemElement} · 나)
                            </span>
                          </td>
                          <td className="border border-slate-300 py-1">
                            <span className="text-base font-black text-slate-900 font-serif-kr">{sajuData.fourPillars.month.stemHanja}</span>
                            <span className="text-[10px] text-slate-600 block">{sajuData.fourPillars.month.stem} ({sajuData.fourPillars.month.stemElement})</span>
                          </td>
                          <td className="border border-slate-300 py-1">
                            <span className="text-base font-black text-slate-900 font-serif-kr">{sajuData.fourPillars.year.stemHanja}</span>
                            <span className="text-[10px] text-slate-600 block">{sajuData.fourPillars.year.stem} ({sajuData.fourPillars.year.stemElement})</span>
                          </td>
                        </tr>
                        {/* 지지 (Earthly Branches) */}
                        <tr>
                          <td className="border border-slate-300 py-1 font-bold" style={{ backgroundColor: '#f8fafc', color: '#334155' }}>
                            지지(地支)
                          </td>
                          <td className="border border-slate-300 py-1">
                            <span className="text-base font-black text-slate-900 font-serif-kr">{sajuData.fourPillars.hour.branchHanja}</span>
                            <span className="text-[10px] text-slate-600 block">{sajuData.fourPillars.hour.branch} ({sajuData.fourPillars.hour.branchAnimal})</span>
                          </td>
                          <td className="border border-slate-300 py-1 font-black" style={{ backgroundColor: '#fffbeb' }}>
                            <span className="text-lg font-black font-serif-kr" style={{ color: '#78350f' }}>{sajuData.fourPillars.day.branchHanja}</span>
                            <span className="text-[10px] block font-bold" style={{ color: '#92400e' }}>
                              {sajuData.fourPillars.day.branch} ({sajuData.fourPillars.day.branchAnimal})
                            </span>
                          </td>
                          <td className="border border-slate-300 py-1">
                            <span className="text-base font-black text-slate-900 font-serif-kr">{sajuData.fourPillars.month.branchHanja}</span>
                            <span className="text-[10px] text-slate-600 block">{sajuData.fourPillars.month.branch} ({sajuData.fourPillars.month.branchAnimal})</span>
                          </td>
                          <td className="border border-slate-300 py-1">
                            <span className="text-base font-black text-slate-900 font-serif-kr">{sajuData.fourPillars.year.branchHanja}</span>
                            <span className="text-[10px] text-slate-600 block">{sajuData.fourPillars.year.branch} ({sajuData.fourPillars.year.branchAnimal})</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. 오행(五行) 에너지 비중 및 분포 */}
                <div className="mb-3.5">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <span>2. 오행(五行) 에너지 비중 및 분포</span>
                  </h2>

                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {(['목', '화', '토', '금', '수'] as const).map((el) => {
                      const count = sajuData.elementCounts[el] || 0;
                      const percent = Math.round((count / 8) * 100);
                      const info = ELEMENT_INFO[el];
                      return (
                        <div key={el} className={`p-1.5 rounded-lg border shadow-xs ${getElementColorClass(el)}`}>
                          <span className="font-bold block text-xs">{info.name} ({info.hanja})</span>
                          <div className="mt-0.5 font-black text-xs">{count}개 ({percent}%)</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. 오늘의 정밀 운세 감정 (Daily Comprehensive Fortune) */}
                <div className="mb-3.5">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <span>3. 오늘의 정밀 운세 감정 (Daily Comprehensive Fortune)</span>
                  </h2>

                  {/* Overall Score Box */}
                  <div 
                    className="p-2.5 rounded-xl border flex items-center justify-between gap-3 mb-2"
                    style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <div>
                      <span className="text-[10px] font-bold block" style={{ color: '#92400e' }}>오늘의 총운 지수</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black" style={{ color: '#78350f' }}>{SAMPLE_TODAY_FORTUNE.totalScore}점</span>
                        <span 
                          className="text-[10px] font-bold px-1.5 py-0.2 rounded-full"
                          style={{ backgroundColor: '#fde68a', color: '#451a03' }}
                        >
                          {SAMPLE_TODAY_FORTUNE.totalScore >= 90 ? '대길(大吉)' : '길(吉)'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 font-serif-kr block">
                        {SAMPLE_TODAY_FORTUNE.title}
                      </span>
                      <span className="text-[10px] text-slate-600">{SAMPLE_TODAY_FORTUNE.easySummary}</span>
                    </div>
                  </div>

                  {/* 4 Fortunes Grid */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[10px]" style={{ color: '#78350f' }}>💰 재물운</span>
                        <span className="font-black text-[10px]" style={{ color: '#b45309' }}>{SAMPLE_TODAY_FORTUNE.elements.wealth.score}점</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">{SAMPLE_TODAY_FORTUNE.elements.wealth.advice}</p>
                    </div>

                    <div className="p-2 rounded-xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[10px]" style={{ color: '#831843' }}>❤️ 애정운</span>
                        <span className="font-black text-[10px]" style={{ color: '#be185d' }}>{SAMPLE_TODAY_FORTUNE.elements.love.score}점</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">{SAMPLE_TODAY_FORTUNE.elements.love.advice}</p>
                    </div>

                    <div className="p-2 rounded-xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[10px]" style={{ color: '#1e3a8a' }}>💼 직업운</span>
                        <span className="font-black text-[10px]" style={{ color: '#1d4ed8' }}>{SAMPLE_TODAY_FORTUNE.elements.career.score}점</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">{SAMPLE_TODAY_FORTUNE.elements.career.advice}</p>
                    </div>

                    <div className="p-2 rounded-xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[10px]" style={{ color: '#064e3b' }}>🌿 건강운</span>
                        <span className="font-black text-[10px]" style={{ color: '#047857' }}>{SAMPLE_TODAY_FORTUNE.elements.health.score}점</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">{SAMPLE_TODAY_FORTUNE.elements.health.advice}</p>
                    </div>
                  </div>
                </div>

                {/* 4. 오늘 하루 시간대별 기운 흐름 (3줄 요약) */}
                <div className="mb-3.5">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>4. 오늘 하루 시간대별 기운 흐름 (3줄 요약)</span>
                  </h2>

                  <div 
                    className="p-3 rounded-xl border space-y-1.5 text-xs"
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded font-bold text-[10px] shrink-0" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                        🌅 오전 (06~12시)
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        맑은 기운으로 집중력과 직관이 상승하니, 중요한 기획을 세우고 주요 업무를 결단하기에 최적입니다.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded font-bold text-[10px] shrink-0" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                        ☀️ 오후 (12~18시)
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        귀인의 조력과 재물운이 맞물리는 골든타임으로, 원활한 소통과 협의를 통해 뜻밖의 성과와 결실을 맺습니다.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded font-bold text-[10px] shrink-0" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
                        🌙 저녁 (18~24시)
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        하루의 피로를 씻고 심신을 편안히 다스리는 시간으로, 내일을 위한 온전한 휴식과 가족과의 온기를 누리세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. 오늘의 추천 로또번호 (숫자 6개) */}
                <div className="mb-2">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center justify-between border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <span className="flex items-center gap-1.5">
                      <Dices className="w-3.5 h-3.5 text-amber-600" />
                      <span>5. 오늘의 추천 로또번호 (황금 행운수 6개)</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-normal">사주오행 기운 기반 정밀 산출</span>
                  </h2>

                  <div 
                    className="p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <div className="flex items-center gap-2.5">
                      {lottoNumbers.map((num, idx) => {
                        const style = getLottoBallStyle(num);
                        return (
                          <div 
                            key={idx}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md select-none transform hover:scale-105 transition-transform"
                            style={{ backgroundColor: style.bg, border: `2px solid ${style.border}` }}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-amber-950 block">행운의 길운 번호 조합</span>
                      <span className="text-[10px] text-amber-800">
                        귀하의 일주 본원 에너지와 감응하는 번호입니다.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page 1 Bottom Footer Bar */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <span>대한민국 정통 명리학술 연구소 運數(UNSU)</span>
                <span className="font-bold text-slate-700">【 1 / 2 페이지 】 (다음 페이지에 6~10번 항목이 이어집니다)</span>
                <span>인증번호: {reportCertId}</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PAGE 2: A4 2페이지 (6.사주요약 ~ 10.행운부적) */}
          {/* ============================================================== */}
          <div className="w-full max-w-[760px] flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 px-1 text-xs text-amber-400 font-bold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF 2페이지 (6.정통사주요약 · 7.띠별/별자리요약 · 8.추천타로 · 9.포춘쿠키 · 10.행운부적)</span>
              </span>
              <span className="text-slate-400">A4 210 × 297mm 규격</span>
            </div>

            <div
              ref={page2Ref}
              className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-200 font-sans flex flex-col justify-between"
              style={{ width: '760px', minHeight: '1075px', backgroundColor: '#ffffff', color: '#0f172a' }}
            >
              <div>
                {/* Page 2 Top Header Mini Banner */}
                <div 
                  className="pb-2.5 mb-3 border-b flex items-center justify-between text-xs"
                  style={{ borderColor: '#d97706' }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-0.5 rounded font-black text-[10px] border"
                      style={{ backgroundColor: '#fef3c7', color: '#78350f', borderColor: '#fcd34d' }}
                    >
                      運數 (UNSU) 2026
                    </span>
                    <span className="font-bold text-slate-800">
                      정통 사주 & 종합 운세 리포트 · 감명 대상자: {currentProfile?.name || '본인'}
                    </span>
                  </div>
                  <span className="font-bold text-slate-500 text-[11px]">【 2 / 2 페이지 】</span>
                </div>

                {/* 6. 정통사주 - 100자 이내로 요약 */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>6. 정통사주 (100자 이내 핵심 요약)</span>
                    </h2>
                    <span className="text-[10px] text-amber-800 font-semibold px-2 py-0.5 rounded bg-amber-100/60 border border-amber-200">
                      {sajuSummary100.length}자 / 100자 이내
                    </span>
                  </div>

                  <div 
                    className="p-3 rounded-xl border text-xs leading-relaxed"
                    style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <p className="font-medium text-slate-800">
                      "{sajuSummary100}"
                    </p>
                  </div>
                </div>

                {/* 7. 띠별, 별자리 - 100자 이내로 요약 */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>7. 띠별·별자리 (100자 이내 핵심 요약)</span>
                    </h2>
                    <span className="text-[10px] text-indigo-800 font-semibold px-2 py-0.5 rounded bg-indigo-100/60 border border-indigo-200">
                      {zodiacSummary100.length}자 / 100자 이내
                    </span>
                  </div>

                  <div 
                    className="p-3 rounded-xl border text-xs leading-relaxed"
                    style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }}
                  >
                    <p className="font-medium text-slate-800">
                      "{zodiacSummary100}"
                    </p>
                  </div>
                </div>

                {/* 8. 추천타로 */}
                <div className="mb-3.5">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>8. 오늘의 추천 타로 (Recommended Tarot)</span>
                  </h2>

                  <div 
                    className="p-3 rounded-xl border flex items-center justify-between gap-4"
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  >
                    {/* Tarot Visual Card Box */}
                    <div 
                      className="w-16 h-22 rounded-xl border-2 flex flex-col items-center justify-center shadow-xs shrink-0 select-none text-center p-1"
                      style={{ borderColor: '#6366f1', backgroundColor: '#eef2ff' }}
                    >
                      <span className="text-2xl mb-1">{recommendedTarot.imageSymbol}</span>
                      <span className="text-[9px] font-black leading-tight text-indigo-950">{recommendedTarot.name}</span>
                      <span className="text-[7px] text-indigo-700 font-bold">정방향(Upright)</span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-serif-kr">
                          {recommendedTarot.nameKr}
                        </span>
                        <div className="flex items-center gap-1">
                          {recommendedTarot.keywords.slice(0, 3).map((kw, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        <strong>【타로 리딩 조언】: </strong>
                        {recommendedTarot.upright.meaning}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 9. 추천포춘쿠키 */}
                <div className="mb-3.5">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <Cookie className="w-3.5 h-3.5 text-amber-600" />
                    <span>9. 오늘의 추천 포춘쿠키 (Fortune Cookie)</span>
                  </h2>

                  <div 
                    className="p-3 rounded-xl border flex items-center gap-3.5"
                    style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-200/80 border border-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                      🥠
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold text-amber-950 font-serif-kr">
                        "{recommendedCookie.koreanQuote}"
                      </h4>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        {recommendedCookie.message}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold block">
                        - {recommendedCookie.authorOrSource}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 10. 행운부적 */}
                <div className="mb-2">
                  <h2 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5 border-l-4 border-amber-600 pl-2 font-serif-kr">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>10. 오늘의 맞춤 행운부적 (Lucky Talisman)</span>
                  </h2>

                  <div 
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-4"
                    style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-red-950 font-serif-kr">
                          {recommendedTalisman.title}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-200 text-red-900 font-bold">
                          {recommendedTalisman.hanja}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {recommendedTalisman.description}
                      </p>
                      <div className="text-[10px] text-red-800 font-semibold">
                        · 효능: {recommendedTalisman.effect}
                      </div>
                      <div className="text-[9px] text-slate-500 italic">
                        · 수호 진언: {recommendedTalisman.mantra}
                      </div>
                    </div>

                    {/* Red Traditional Amulet Seal Stamp */}
                    <div 
                      className="w-16 h-20 rounded-xl border-3 border-red-700 bg-red-100/60 flex flex-col items-center justify-center text-red-700 shrink-0 font-serif-kr select-none shadow-sm"
                      style={{ borderColor: '#b91c1c', backgroundColor: '#fef2f2', color: '#b91c1c' }}
                    >
                      <span className="text-[8px] font-bold">萬事亨通</span>
                      <span className="text-base font-black leading-tight">大吉</span>
                      <span className="text-[8px] font-bold leading-tight">財物大通</span>
                      <span className="text-[7px] text-red-600">運數開運</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification & Disclaimer Footer */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
                <div>
                  <span>발행 기관: 대한민국 정통 명리학술 연구소 運數(UNSU)</span>
                  <span className="mx-2">·</span>
                  <span>공식 검증 코드: {reportCertId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p>© 2026 UNSU Fortune & Saju Analytics. All rights reserved.</p>
                  <span className="font-bold text-slate-800">【 2 / 2 페이지 완결 】</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>1~10번 전 항목 탑재 (로또번호 · 100자요약 · 타로 · 포춘쿠키 · 부적) 완료</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄 / PDF로 저장</span>
            </button>
            <button
              type="button"
              onClick={closeReportModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              닫기
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPdf}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>다운로드 생성 중...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>PDF 파일 다운로드</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
