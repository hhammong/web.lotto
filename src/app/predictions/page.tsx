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
    predictionId?: string;
}

// 통계 정보 인터페이스 추가
interface PredictionStats {
    totalDraws: number;
    winningDraws: number;
    totalPrizeAmount: number;
    netProfit: number;
    returnRate: number;
    bestRank: number | null;
    isLoading?: boolean;
}

export default function PredictionsPage() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // 각 예측의 통계 정보를 저장
    const [statsMap, setStatsMap] = useState<Record<string, PredictionStats>>({});

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
                    let predictionsList: Prediction[] = [];
                    if (Array.isArray(result)) {
                        predictionsList = result;
                    } else if (result.data && Array.isArray(result.data)) {
                        predictionsList = result.data;
                    } else if (result.predictions && Array.isArray(result.predictions)) {
                        predictionsList = result.predictions;
                    }
                    setPredictions(predictionsList);
                    setError(null);
                    
                    // 각 예측의 통계 정보 가져오기
                    /* predictionsList.forEach((prediction) => {
                        const predictionId = prediction.predictionId || prediction.id;
                        if (predictionId) {
                            fetchPredictionStats(predictionId);
                        }
                    }); */
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

    // 각 예측의 통계 정보 가져오기
    const fetchPredictionStats = async (predictionId: string) => {
        if (!userId) return;
        
        // 로딩 상태 설정
        setStatsMap(prev => ({
            ...prev,
            [predictionId]: { ...prev[predictionId], isLoading: true } as PredictionStats
        }));

        try {
            const response = await fetch(`/api/users/${userId}/predictions/${predictionId}/history`);
            const result = await response.json();

            if (response.ok && result.success && result.data) {
                const data = result.data;
                setStatsMap(prev => ({
                    ...prev,
                    [predictionId]: {
                        totalDraws: data.totalDraws || 0,
                        winningDraws: data.winningDraws || 0,
                        totalPrizeAmount: data.totalPrizeAmount || 0,
                        netProfit: data.netProfit || 0,
                        returnRate: data.returnRate || 0,
                        bestRank: data.bestRank || null,
                        isLoading: false
                    }
                }));
            }
        } catch (error) {
            console.error(`Failed to fetch stats for prediction ${predictionId}:`, error);
            setStatsMap(prev => ({
                ...prev,
                [predictionId]: { ...prev[predictionId], isLoading: false } as PredictionStats
            }));
        }
    };

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
                                {predictions.map((prediction, index) => {
                                    const predictionId = prediction.predictionId || prediction.id || '';
                                    const stats = statsMap[predictionId];
                                    
                                    return (
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
                                            <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
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
                                                    <Link href={`/predictions/${prediction.predictionId}`}>
                                                        <p>상세보기</p>
                                                    </Link>
                                                </Button>
                                            </div>
                                            
                                            {/* 통계 요약 추가 */}
                                            {stats && !stats.isLoading ? (
                                                <div className="border-t pt-4 mt-4">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                        <div className="text-center">
                                                            <p className="text-lg font-bold text-blue-600">{stats.totalDraws}회</p>
                                                            <p className="text-xs text-gray-600">총 참여</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-bold text-green-600">{stats.winningDraws}회</p>
                                                            <p className="text-xs text-gray-600">당첨</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-bold text-purple-600">
                                                                {stats.totalPrizeAmount.toLocaleString()}원
                                                            </p>
                                                            <p className="text-xs text-gray-600">총 당첨금</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className={`text-lg font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {stats.netProfit.toLocaleString()}원
                                                            </p>
                                                            <p className="text-xs text-gray-600">순손익</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                                        <span className="text-xs text-gray-600">수익률</span>
                                                        <span className={`text-sm font-bold ${stats.returnRate >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {stats.returnRate.toFixed(1)}%
                                                        </span>
                                                        {stats.bestRank && (
                                                            <>
                                                                <span className="text-xs text-gray-600">최고 등수</span>
                                                                <span className="text-sm font-bold text-blue-600">
                                                                    {stats.bestRank}등
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : stats?.isLoading ? (
                                                <div className="border-t pt-4 mt-4 text-center">
                                                    <p className="text-xs text-gray-400">통계 로딩 중...</p>
                                                </div>
                                            ) : null}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}