'use client';

import { useState, useEffect } from 'react';

export default function LottoPicker() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < 6) {
        setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
      }
    }
  };

  const autoSelect = () => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const random = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(random)) {
        numbers.push(random);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const reset = () => {
    setSelectedNumbers([]);
    setSubmitted(false);
  };

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('=== 사용자 정보 확인 ===');
        console.log('전체 user 객체:', user);
        console.log('user 객체의 모든 키:', Object.keys(user));
        
        // 다양한 가능한 필드명 확인
        const foundUserId = user.userId || user.id || user.user_id || user._id || user.uuid || null;
        console.log('찾은 userId:', foundUserId);
        
        if (foundUserId) {
          setUserId(foundUserId);
        } else {
          console.error('userId를 찾을 수 없습니다. user 객체:', user);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    } else {
      console.log('localStorage에 user 데이터가 없습니다.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
console.log(selectedNumbers);    
console.log(userId);    
    if (selectedNumbers.length !== 6) {
      return;
    }

    // 로그인 확인
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);

    const requestBody = {
      numbers: selectedNumbers
    };

    console.log('=== 예측 등록 요청 시작 ===');
    console.log('URL:', `/api/users/${userId}/predictions`);
    console.log('요청 데이터:', requestBody);
    console.log('선택된 번호:', selectedNumbers);
    console.log('사용자 ID:', userId);

    try {
      const response = await fetch(`/api/users/${userId}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('=== 응답 정보 ===');
      console.log('응답 상태 코드:', response.status);
      console.log('응답 상태 텍스트:', response.statusText);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('응답 데이터:', result);

      if (response.ok) {
        console.log('✅ 등록 성공');
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedNumbers([]);
        }, 3000);
      } else {
        console.error('❌ 등록 실패');
        console.error('에러 상태 코드:', response.status);
        console.error('에러 응답:', result);
        alert(result.error.message || `등록에 실패했습니다. (상태 코드: ${response.status})`);
      }
    } catch (error) {
      console.error('=== 요청 중 예외 발생 ===');
      console.error('에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('에러 메시지:', error instanceof Error ? error.message : String(error));
      console.error('에러 스택:', error instanceof Error ? error.stack : 'N/A');
      console.error('전체 에러 객체:', error);
      alert(`등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
      console.log('=== 예측 등록 요청 종료 ===');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 md:p-12 flex items-center justify-center">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .slide-down {
          animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
      
      <div className="fade-in-up max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-6xl md:text-7xl font-light text-slate-800 mb-3 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Lotto 6/45
          </h1>
          <p 
            className="text-slate-500 text-lg font-light"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            행운의 번호를 선택하세요
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-morphism rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden">
          
          {/* Selected Numbers Section */}
          <div className="p-8 md:p-12 border-b border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-medium text-slate-700"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                선택된 번호
              </h2>
              <div 
                className="text-sm font-mono text-slate-500 bg-slate-100 px-4 py-2 rounded-full"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {selectedNumbers.length}/6
              </div>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap min-h-[100px] items-center">
              {selectedNumbers.length === 0 ? (
                <p 
                  className="text-slate-400 text-base font-light"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  No numbers selected yet
                </p>
              ) : (
                selectedNumbers.map((num, index) => (
                  <div
                    key={num}
                    className="scale-in group relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
                    onClick={() => toggleNumber(num)}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <span 
                      className="text-3xl font-semibold text-white"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {num}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Number Grid Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-9 gap-2 md:gap-3 mb-8">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                const isSelected = selectedNumbers.includes(num);
                const isDisabled = !isSelected && selectedNumbers.length >= 6;
                
                return (
                  <button
                    key={num}
                    onClick={() => toggleNumber(num)}
                    disabled={isDisabled}
                    className={`
                      aspect-square rounded-xl font-medium text-base md:text-lg transition-all duration-200
                      ${isSelected 
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-400/30 scale-105' 
                        : isDisabled
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md hover:scale-105 border border-slate-200 shadow-sm'
                      }
                    `}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
              <button
                type="button"
                onClick={autoSelect}
                className="px-6 md:px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                자동 선택
              </button>
              
              <button
                type="button"
                onClick={reset}
                className="px-6 md:px-8 py-3.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                초기화
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedNumbers.length !== 6 || isLoading}
                className={`
                  px-6 md:px-8 py-3.5 font-medium rounded-xl transition-all duration-200 flex items-center gap-2
                  ${selectedNumbers.length === 6 && !isLoading
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-400/30 hover:shadow-xl hover:shadow-slate-400/40 transform hover:scale-105 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }
                `}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    등록 중...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    등록
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="slide-down mt-6 glass-morphism rounded-2xl border border-green-200/50 p-6 shadow-xl shadow-green-100/50">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-400/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 
                  className="text-xl font-semibold text-slate-800"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  등록이 완료되었습니다
                </h3>
                <p 
                  className="text-sm text-slate-600 font-light"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  오늘의 행운을 빌어요!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p 
            className="text-sm text-slate-400 font-light"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            1부터 45까지 중 6개의 번호를 선택하세요
          </p>
        </div>
      </div>
    </div>
  );
}