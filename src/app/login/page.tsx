"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [password, setPassword] = useState("")
    const [userUid, setUserUid] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // 입력값 검증
        if (!userUid || !password) {
            alert('아이디와 비밀번호를 입력해주세요')
            return
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userUid: userUid,
                    password: password
                })
            })
            
            const result = await response.json()
            
            if (response.ok && result.success) {
                // 로그인 성공 - 토큰 저장
                if (result.token) {
                    localStorage.setItem('token', result.token)
                    localStorage.setItem('user', JSON.stringify(result.user))
                    // 로그인 이벤트 발생하여 Header 컴포넌트에 알림
                    window.dispatchEvent(new Event('userLogin'))
                }
                router.push("/")
            } else {
                // 로그인 실패 - 에러 메시지 표시
                alert(result.message || '로그인에 실패했습니다')
            }
        } catch (error) {
            console.error('Login error:', error)
            alert('로그인 중 오류가 발생했습니다')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">LOTTO</h1>
                <p className="text-gray-600">로그인하여 당첨 번호를 확인하세요</p>
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md bg-white shadow-2xl">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">로그인</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* userUid Field */}
                        <div className="space-y-2">
                            <Label htmlFor="userUid" className="text-gray-700 font-semibold">
                                아이디
                            </Label>
                            <Input
                                id="userUid"
                                type="text"
                                placeholder="user"
                                value={userUid}
                                onChange={(e) => setUserUid(e.target.value)}
                                className="border-gray-300 focus:border-blue-600"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-semibold">
                                비밀번호
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-gray-300 focus:border-blue-600"
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 mt-6">
                            로그인
                        </Button>
                    </form>

                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 text-sm">
                        아직 계정이 없으신가요?{" "}
                        <a href="/signup" className="text-blue-600 font-semibold hover:underline">
                            회원가입
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    )
}
