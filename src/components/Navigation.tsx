import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">홈</Link>
      <Link href="/mypage" style={{ marginLeft: '1rem' }}>마이페이지</Link>
    </nav>
  );
}