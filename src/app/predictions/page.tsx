"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function getNumberColorClass(num: number): string {
    if (num >= 1 && num <= 10) {
        return "bg-yellow-500";
    } else if (num >= 11 && num <= 20) {
        return "bg-blue-500";
    } else if (num >= 21 && num <= 30) {
        return "bg-red-500";
    } else if (num >= 31 && num <= 40) {
        return "bg-gray-500";
    } else if (num >= 41 && num <= 45) {
        return "bg-green-500";
    }
    return "bg-blue-500";
}

interface Prediction {
    id?: string;
    numbers: number[];
    createdAt?: string;
    drawNo?: number;
}

export default function PredictionsPage() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const foundUserId = user.userId || user.id || user.user_id || user._id || user.uuid || null;
                if (foundUserId) {
                    setUserId(foundUserId);
                } else {
                    setError('사용자 정보를 찾을 수 없습니다.');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to parse user data:', error);
                setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
                setIsLoading(false);
            }
        } else {
            setError('로그인이 필요합니다.');
            setIsLoading(false);
        }
    }, []);

    // 예측 목록 가져오기
    useEffect(() => {
        if (!userId) return;

        const fetchPredictions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${userId}/predictions`);
                const result = await response.json();

                if (response.ok) {
                    // 응답 데이터 구조에 따라 조정
                    if (Array.isArray(result)) {
                        setPredictions(result);
                    } else if (result.data && Array.isArray(result.data)) {
                        setPredictions(result.data);
                    } else if (result.predictions && Array.isArray(result.predictions)) {
                        setPredictions(result.predictions);
                    } else {
                        setPredictions([]);
                    }
                    setError(null);
                } else {
                    setError(result.message || '예측 목록을 불러오는 중 오류가 발생했습니다.');
                    setPredictions([]);
                }
            } catch (error) {
                console.error('Failed to fetch predictions:', error);
                setError('예측 목록을 불러오는 중 오류가 발생했습니다.');
                setPredictions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPredictions();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <Card className="p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <Card className="p-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <a href="/login" className="text-blue-600 hover:underline">로그인 페이지로 이동</a>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">예측 목록</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {predictions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg mb-4">등록된 예측이 없습니다.</p>
                                <a 
                                    href="/predictions/new" 
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    새 예측 등록하기
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {predictions.map((prediction, index) => (
                                    <Card key={prediction.id || index} className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                {prediction.drawNo && (
                                                    <span className="text-sm text-gray-500">
                                                        {prediction.drawNo}회차
                                                    </span>
                                                )}
                                                {prediction.createdAt && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(prediction.createdAt).toLocaleString('ko-KR')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <div className="flex gap-2 flex-wrap">
                                                {prediction.numbers && prediction.numbers.length > 0 ? (
                                                    prediction.numbers.map((num) => (
                                                        <div
                                                            key={num}
                                                            className={`w-12 h-12 rounded-full ${getNumberColorClass(num)} text-white flex items-center justify-center font-bold`}
                                                        >
                                                            {num}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">번호 정보가 없습니다.</p>
                                                )}
                                            </div>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4">
                                                <Link href={`/predictions/${prediction.id}`}>
                                                    <p>상세보기</p>
                                                </Link>
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}