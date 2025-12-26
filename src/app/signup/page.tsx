"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // 유효성 검사
        if (!name || !email || !password || !confirmPassword) {
            setError("모든 필드를 입력해주세요")
            return
        }

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다")
            return
        }

        if (password.length < 6) {
            setError("비밀번호는 최소 6자 이상이어야 합니다")
            return
        }

        // 회원가입 처리 (실제로는 서버 인증 필요)
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">LOTTO</h1>
                <p className="text-gray-600">계정을 만들어 당첨 번호를 확인하세요</p>
            </div>

            {/* Signup Card */}
            <Card className="w-full max-w-md bg-white shadow-2xl">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">회원가입</h2>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Error Message */}
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-semibold">
                                이름
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="홍길동"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-gray-300 focus:border-blue-600"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold">
                                이메일
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                                비밀번호 확인
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border-gray-300 focus:border-blue-600"
                                required
                            />
                        </div>

                        {/* Signup Button */}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 mt-6">
                            회원가입
                        </Button>
                    </form>

                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Login Link */}
                    <p className="text-center text-gray-600 text-sm">
                        이미 계정이 있으신가요?{" "}
                        <a href="/login" className="text-blue-600 font-semibold hover:underline">
                            로그인
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    )
}
