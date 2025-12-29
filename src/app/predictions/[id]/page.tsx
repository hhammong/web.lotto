"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function getNumberColorClass(num: number): string {
    if (num >= 1 && num <= 10) return "bg-yellow-500";
    if (num >= 11 && num <= 20) return "bg-blue-500";
    if (num >= 21 && num <= 30) return "bg-red-500";
    if (num >= 31 && num <= 40) return "bg-gray-500";
    if (num >= 41 && num <= 45) return "bg-green-500";
    return "bg-blue-500";
}

interface HistoryItem {
    drawNo: number;
    drawDate: string;
    winningNumbers: number[];
    bonusNumber: number;
    matchCount: number;
    hasBonus: boolean;
    rank: number | null;
    rankDescription: string;
    prizeAmount: number;
    matchedNumbers: number[];
}

interface PredictionDetail {
    predictionId: string;
    myNumbers: number[];
    memo: string;
    createdAt: string;
    startDrawNo: number;
    history: HistoryItem[];
    totalDraws: number;
    winningDraws: number;
    rank1Count: number;
    rank2Count: number;
    rank3Count: number;
    rank4Count: number;
    rank5Count: number;
    totalPrizeAmount: number;
    totalInvestment: number;
    netProfit: number;
    returnRate: number;
    bestRank: number | null;
    bestDrawNo: number | null;
    summaryMessage: string;
}

export default function PredictionDetailPage() {
    const params = useParams();
    const predictionId = params.id as string;
    
    const [data, setData] = useState<PredictionDetail | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 사용자 정보 가져오기
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

    // 예측 상세 데이터 가져오기
    useEffect(() => {
        if (!userId || !predictionId) return;

        const fetchPredictionDetail = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${userId}/predictions/${predictionId}/history`);
                const result = await response.json();

                if (response.ok && result.success) {
                    setData(result.data);
                    setError(null);
                } else {
                    setError(result.message || '데이터를 불러오는 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('Failed to fetch prediction detail:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPredictionDetail();
    }, [userId, predictionId]);

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

    if (error || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <Card className="p-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || '데이터를 찾을 수 없습니다.'}</p>
                        <Link href="/predictions" className="text-blue-600 hover:underline">
                            목록으로 돌아가기
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="mb-6">
                    <Link href="/predictions">
                        <Button variant="outline" className="mb-4">← 목록으로</Button>
                    </Link>
                </div>

                {/* 내 예측 번호 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>내 예측 번호</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4">
                            {data.myNumbers.map((num) => (
                                <div
                                    key={num}
                                    className={`w-14 h-14 rounded-full ${getNumberColorClass(num)} text-white flex items-center justify-center font-bold text-lg`}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                        {data.memo && (
                            <p className="text-gray-600 text-sm">💬 {data.memo}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-2">
                            등록일: {new Date(data.createdAt).toLocaleString('ko-KR')}
                        </p>
                    </CardContent>
                </Card>

                {/* 통계 요약 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>통계 요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{data.totalDraws}회</p>
                                <p className="text-sm text-gray-600">총 참여</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{data.winningDraws}회</p>
                                <p className="text-sm text-gray-600">당첨</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                    {data.totalPrizeAmount.toLocaleString()}원
                                </p>
                                <p className="text-sm text-gray-600">총 당첨금</p>
                            </div>
                            <div className="text-center">
                                <p className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {data.netProfit.toLocaleString()}원
                                </p>
                                <p className="text-sm text-gray-600">순손익</p>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">등수별 당첨</span>
                                <span className="text-sm font-medium">
                                    1등: {data.rank1Count} | 2등: {data.rank2Count} | 3등: {data.rank3Count} | 
                                    4등: {data.rank4Count} | 5등: {data.rank5Count}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">수익률</span>
                                <span className={`text-sm font-bold ${data.returnRate >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                    {data.returnRate.toFixed(1)}%
                                </span>
                            </div>
                            {data.bestRank && (
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-600">최고 등수</span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {data.bestRank}등 ({data.bestDrawNo}회차)
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 회차별 당첨 내역 */}
                <Card>
                    <CardHeader>
                        <CardTitle>회차별 당첨 내역</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                            {data.startDrawNo}회차부터 총 {data.totalDraws}회 참여
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {data.history.map((item) => (
                                <Card 
                                    key={item.drawNo} 
                                    className={`p-4 ${item.rank ? 'border-2 border-green-500 bg-green-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="font-bold text-lg">{item.drawNo}회</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {new Date(item.drawDate).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-bold ${item.rank ? 'text-green-600' : 'text-gray-500'}`}>
                                                {item.rankDescription}
                                            </span>
                                            {item.prizeAmount > 0 && (
                                                <p className="text-sm text-green-600 font-medium">
                                                    {item.prizeAmount.toLocaleString()}원
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-gray-600">당첨번호:</span>
                                        <div className="flex gap-1">
                                            {item.winningNumbers.map((num) => {
                                                const isMatched = item.matchedNumbers.includes(num);
                                                return (
                                                    <div
                                                        key={num}
                                                        className={`w-8 h-8 rounded-full ${getNumberColorClass(num)} text-white flex items-center justify-center text-xs font-bold ${isMatched ? 'ring-4 ring-yellow-400' : 'opacity-50'}`}
                                                    >
                                                        {num}
                                                    </div>
                                                );
                                            })}
                                            <span className="mx-1 text-gray-400">+</span>
                                            <div className={`w-8 h-8 rounded-full ${getNumberColorClass(item.bonusNumber)} text-white flex items-center justify-center text-xs font-bold ${item.hasBonus ? 'ring-4 ring-yellow-400' : 'opacity-50'}`}>
                                                {item.bonusNumber}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm">
                                        <span className="text-gray-600">맞힌 개수: </span>
                                        <span className="font-bold text-blue-600">{item.matchCount}개</span>
                                        {item.hasBonus && (
                                            <span className="ml-2 text-yellow-600 font-bold">+ 보너스</span>
                                        )}
                                    </div>
                                    
                                    {item.matchedNumbers.length > 0 && (
                                        <div className="text-sm mt-1">
                                            <span className="text-gray-600">맞힌 번호: </span>
                                            <span className="font-medium">{item.matchedNumbers.join(', ')}</span>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}