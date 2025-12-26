'use client';  // 클라이언트 컴포넌트로 선언

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function Header() {
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 상태 확인 함수
  const checkUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser({
        nickname: user.nickname,
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // 초기 로그인 상태 확인
    checkUser();

    // localStorage 변경 감지를 위한 커스텀 이벤트 리스너
    const handleStorageChange = () => {
      checkUser();
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleStorageChange);
    window.addEventListener('userLogout', handleStorageChange);

    // pathname 변경 시에도 체크 (페이지 이동 시)
    checkUser();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
      window.removeEventListener('userLogout', handleStorageChange);
    };
  }, [pathname]); // pathname이 변경될 때마다 체크

  const handleLogout = () => {
    const confirmed = confirm("로그아웃하시겠습니까?")
    if (confirmed) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      // 로그아웃 이벤트 발생
      window.dispatchEvent(new Event('userLogout'));
      router.push('/');
    }
  };

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Navigation />
        
        <div>
          {user ? (
            <>
              <span>{user.nickname}님</span>
              <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={() => router.push('/login')}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}