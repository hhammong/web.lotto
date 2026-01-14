import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        
        const response = await fetch('http://localhost:8081/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userUid: body.userUid,
                nickname: body.nickname,
                name: body.name,
                password: body.password
            })
        })
        
        const data = await response.json()
        
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Signup API error:', error)
        return NextResponse.json(
            { success: false, message: '회원가입 중 오류가 발생했습니다' },
            { status: 500 }
        )
    }
}

