import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; predictionId: string }> }
) {
    try {
        const { userId, predictionId } = await params;
        
        const response = await fetch(
            `http://localhost:8081/api/users/${userId}/predictions/${predictionId}/history`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: '서버 오류가 발생했습니다.',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}