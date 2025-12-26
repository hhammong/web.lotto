'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function GoToCreatePredictionButton() {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        // 로그인 상태 확인
        const userData = localStorage.getItem('user');
        
        if (!userData) {
            // 로그인하지 않은 경우
            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            router.push('/login');
        } else {
            // 로그인한 경우
            router.push('/predictions/new');
        }
    };

    return (
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 font-semibold" asChild>
            <a href="/predictions/new" onClick={handleClick}>번호 등록</a>
        </Button>
    );
}

