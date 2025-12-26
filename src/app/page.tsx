// src/app/page.tsx
import {Button} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RegisterButton from "@/components/GoToCreatePredictionButton";

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
    return "bg-blue-500"; // 기본값
}

async function Home() {
    // 서버에서 직접 fetch
    const response = await fetch('http://localhost:8081/api/lotto/latest');
    const result = await response.json();
    const data = result.data; // 실제 로또 데이터는 result.data 안에!

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <Card className="flex flex-col items-center gap-4 p-8">
                    <h1 className="text-3xl font-bold">
                        <span className="text-gray-400 drop-shadow-lg font-extrabold">{data.drawNo}</span>
                        회 당첨번호
                    </h1>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">[ {data.drawDate} ]</p>

                        <div className="flex gap-2 mt-8 items-center">
                            {data.numbers.map((num: number) => (
                                <div key={num} className={`w-12 h-12 rounded-full ${getNumberColorClass(num)} text-white flex items-center justify-center font-bold`}>
                                    {num}
                                </div>
                            ))}
                            <p>+</p>
                            <div className={`w-12 h-12 rounded-full ${getNumberColorClass(data.bonusNumber)} text-white flex items-center justify-center font-bold`}>
                                {data.bonusNumber}
                            </div>
                        </div>


                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <RegisterButton />
                        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-6 font-semibold" asChild>
                            <a href="/predictions">예측 목록</a>
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-6 font-semibold" asChild>
                            <a href="/login">로그인</a>
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}

export default Home;