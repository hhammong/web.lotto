import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> | { userId: string } }
) {
  // Next.js 15+에서는 params가 Promise일 수 있음
  const resolvedParams = params instanceof Promise ? await params : params;
  const { userId } = resolvedParams;

  // URL에서도 userId 추출 시도 (백업)
  const url = new URL(request.url);
  const urlPathParts = url.pathname.split('/');
  const userIdFromUrl = urlPathParts[urlPathParts.indexOf('users') + 1];

  const finalUserId = userId || userIdFromUrl;
  if (!finalUserId || finalUserId === 'undefined') {
    return NextResponse.json(
      { 
        success: false, 
        message: '사용자 ID가 없습니다',
        error: 'userId is missing or undefined'
      },
      { status: 400 }
    );
  }

  try {
    const backendUrl = `http://localhost:8081/api/users/${finalUserId}/predictions`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ 백엔드 요청 실패');
      console.error('에러 상태 코드:', response.status);
      console.error('에러 응답:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('=== API 라우트 에러 ===');
    console.error('에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('에러 메시지:', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        success: false, 
        message: '예측 목록 조회 중 오류가 발생했습니다',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> | { userId: string } }
) {
  // Next.js 15+에서는 params가 Promise일 수 있음
  const resolvedParams = params instanceof Promise ? await params : params;
  const { userId } = resolvedParams;

  // URL에서도 userId 추출 시도 (백업)
  const url = new URL(request.url);
  const urlPathParts = url.pathname.split('/');
  const userIdFromUrl = urlPathParts[urlPathParts.indexOf('users') + 1];

  console.log('=== API 라우트: 예측 등록 요청 ===');
  console.log('params 객체:', resolvedParams);
  console.log('params에서 추출한 userId:', userId);
  console.log('URL에서 추출한 userId:', userIdFromUrl);
  console.log('요청 URL:', request.url);
  
  // userId가 없으면 에러 반환
  const finalUserId = userId || userIdFromUrl;
  if (!finalUserId || finalUserId === 'undefined') {
    console.error('❌ userId가 없습니다!');
    console.error('params:', resolvedParams);
    console.error('URL pathname:', url.pathname);
    return NextResponse.json(
      { 
        success: false, 
        message: '사용자 ID가 없습니다',
        error: 'userId is missing or undefined'
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json()
    console.log('요청 본문:', body);

    const backendUrl = `http://localhost:8081/api/users/${finalUserId}/predictions`;
    console.log('백엔드 URL:', backendUrl);
    console.log('백엔드로 전송할 데이터:', JSON.stringify(body));

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    console.log('=== 백엔드 응답 정보 ===');
    console.log('응답 상태 코드:', response.status);
    console.log('응답 상태 텍스트:', response.statusText);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

    const data = await response.json()
    console.log('백엔드 응답 데이터:', data);

    if (!response.ok) {
      console.error('❌ 백엔드 요청 실패');
      console.error('에러 상태 코드:', response.status);
      console.error('에러 응답:', data);
    } else {
      console.log('✅ 백엔드 요청 성공');
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('=== API 라우트 에러 ===');
    console.error('에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('에러 메시지:', error instanceof Error ? error.message : String(error));
    console.error('에러 스택:', error instanceof Error ? error.stack : 'N/A');
    console.error('전체 에러 객체:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '예측 등록 중 오류가 발생했습니다',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

