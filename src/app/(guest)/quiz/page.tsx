"use client"

import type React from "react"

import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DrySkinRoutine from "@/components/skin/DrySkinRoutine"
import NormalSkinRoutine from "@/components/skin/NormalSkinRoutine"
import OilySkinRoutine from "@/components/skin/OilySkinRoutine"
import CombinationSkinRoutine from "@/components/skin/CombinationSkinRoutine"

// Skin type quiz data
const quizData = [
  {
    id: "texture",
    question: "Sau khi rửa mặt, da bạn cảm thấy thế nào?",
    options: [
      { value: "da khô", label: "Khô và căng" },
      { value: "da thường", label: "Thoải mái và cân bằng" },
      { value: "da dầu", label: "Bóng nhờn" },
      { value: "da hỗn hợp", label: "Bóng nhờn vùng chữ T, bình thường/khô ở nơi khác" },
    ],
  },
  {
    id: "pores",
    question: "Lỗ chân lông của bạn có rõ không?",
    options: [
      { value: "da khô", label: "Gần như không thấy" },
      { value: "da thường", label: "Ít thấy" },
      { value: "da dầu", label: "Rất rõ, đặc biệt ở vùng chữ T" },
      { value: "da hỗn hợp", label: "Rõ ở vùng chữ T, ít hơn ở nơi khác" },
    ],
  },
  {
    id: "sensitivity",
    question: "Da bạn phản ứng thế nào với sản phẩm mới?",
    options: [
      { value: "da nhạy cảm", label: "Thường bị kích ứng hoặc đỏ" },
      { value: "da thường", label: "Hiếm khi có phản ứng tiêu cực" },
      { value: "da dầu", label: "Hiếm khi có phản ứng tiêu cực" },
      { value: "da hỗn hợp", label: "Đôi khi bị kích ứng" },
    ],
  },
  {
    id: "hydration",
    question: "Da bạn có cảm thấy khô vào cuối ngày không?",
    options: [
      { value: "da khô", label: "Rất khô và bong tróc" },
      { value: "da thường", label: "Không khô, vẫn mềm mại" },
      { value: "da dầu", label: "Không, vẫn bóng nhờn" },
      { value: "da hỗn hợp", label: "Chỉ khô ở một số vùng nhất định" },
    ],
  },
  {
    id: "acne",
    question: "Bạn có thường bị mụn không?",
    options: [
      { value: "da khô", label: "Rất hiếm khi" },
      { value: "da thường", label: "Đôi khi" },
      { value: "da dầu", label: "Thường xuyên, đặc biệt ở vùng chữ T" },
      { value: "da hỗn hợp", label: "Chỉ ở một số vùng nhất định" },
    ],
  },
  {
    id: "makeup",
    question: "Trang điểm của bạn giữ được bao lâu?",
    options: [
      { value: "da khô", label: "Bị khô, dễ bong tróc" },
      { value: "da thường", label: "Giữ tốt cả ngày" },
      { value: "da dầu", label: "Nhanh trôi, bóng dầu" },
      { value: "da hỗn hợp", label: "Trôi ở vùng chữ T, giữ ở nơi khác" },
    ],
  },
  {
    id: "sun_reaction",
    question: "Da bạn phản ứng thế nào với ánh nắng mặt trời?",
    options: [
      { value: "da nhạy cảm", label: "Dễ đỏ và cháy nắng" },
      { value: "da thường", label: "Cháy nắng nhẹ nhưng không quá nghiêm trọng" },
      { value: "da dầu", label: "Ít bị cháy nắng, da thường tối màu hơn" },
      { value: "da hỗn hợp", label: "Cháy nắng ở một số vùng nhưng không đều" },
    ],
  },
  {
    id: "fine_lines",
    question: "Bạn có nhận thấy nếp nhăn hoặc đường nhăn nào không?",
    options: [
      { value: "da khô", label: "Có nhiều, đặc biệt quanh mắt và miệng" },
      { value: "da thường", label: "Ít nếp nhăn, da vẫn căng" },
      { value: "da dầu", label: "Hầu như không có nếp nhăn" },
      { value: "da hỗn hợp", label: "Một số vùng có nếp nhăn rõ hơn vùng khác" },
    ],
  },
  {
    id: "elasticity",
    question: "Da bạn có độ đàn hồi tốt không?",
    options: [
      { value: "da khô", label: "Kém đàn hồi, dễ nhăn" },
      { value: "da thường", label: "Đàn hồi tốt" },
      { value: "da dầu", label: "Rất đàn hồi, săn chắc" },
      { value: "da hỗn hợp", label: "Một số vùng đàn hồi tốt hơn vùng khác" },
    ],
  },
  {
    id: "skincare_absorption",
    question: "Da bạn hấp thụ kem dưỡng như thế nào?",
    options: [
      { value: "da khô", label: "Nhanh thấm nhưng vẫn cần dưỡng thêm" },
      { value: "da thường", label: "Thấm vừa phải, không bị nhờn" },
      { value: "da dầu", label: "Khó hấp thụ, dễ bị nhờn" },
      { value: "da hỗn hợp", label: "Một số vùng thấm nhanh hơn vùng khác" },
    ],
  },
]

// Skin type descriptions
const skinTypeDescriptions: Record<string, string> = {
  "da khô":
    "Da khô thường thiếu độ ẩm, dễ bong tróc và cảm thấy căng. Bạn nên sử dụng các sản phẩm dưỡng ẩm đậm đặc và tránh các sản phẩm có cồn.",
  "da thường":
    "Da thường có độ ẩm cân bằng, ít gặp vấn đề và dễ chăm sóc. Bạn nên duy trì lộ trình chăm sóc đơn giản để giữ làn da khỏe mạnh.",
  "da dầu":
    "Da dầu thường tiết nhiều dầu, dễ bị mụn và lỗ chân lông to. Bạn nên sử dụng các sản phẩm không gây bít tắc lỗ chân lông và kiểm soát dầu.",
  "da hỗn hợp":
    "Da hỗn hợp có vùng chữ T (trán, mũi, cằm) dầu nhưng má khô hoặc bình thường. Bạn nên sử dụng các sản phẩm khác nhau cho các vùng khác nhau trên khuôn mặt.",
  "da nhạy cảm":
    "Da nhạy cảm dễ bị kích ứng, đỏ và khó chịu khi tiếp xúc với một số sản phẩm. Bạn nên sử dụng các sản phẩm dịu nhẹ, không chứa hương liệu và chất gây kích ứng.",
}

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [skinType, setSkinType] = useState<string | null>(null)
  const [showRoutine, setShowRoutine] = useState(false)

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const determineSkinType = () => {
    const counts: Record<string, number> = {}
    Object.values(answers).forEach((value) => {
      counts[value] = (counts[value] || 0) + 1
    })

    const maxCount = Math.max(...Object.values(counts))
    const skinTypes = Object.keys(counts).filter((key) => counts[key] === maxCount)

    return skinTypes.length === 1 ? skinTypes[0] : "da hỗn hợp"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = determineSkinType()
    setSkinType(result)
    setSubmitted(true)
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleNext = () => {
    if (!api) return
    api.scrollNext()
  }

  const handlePrevious = () => {
    if (!api) return
    api.scrollPrev()
  }

  const isLastQuestion = current === quizData.length - 1

  // Set up carousel API
  const onApiChange = (api: CarouselApi) => {
    setApi(api)

    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }

  
  const routineComponents: Record<string, React.FC> = {
    "da khô": DrySkinRoutine,
    "da thường": NormalSkinRoutine,
    "da dầu": OilySkinRoutine,
    "da hỗn hợp": CombinationSkinRoutine,
  }

  const RoutineComponent = skinType ? routineComponents[skinType] : null
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Trắc nghiệm loại da</h1>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Câu hỏi {current + 1}: {quizData[current].question}
              </CardTitle>
            </CardHeader>

            <Carousel className="w-full" setApi={onApiChange}>
              <CarouselContent>
                {quizData.map((question, index) => (
                  <CarouselItem key={question.id}>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {question.options.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant="outline"
                            size="lg"
                            className={`min-h-[5rem] h-auto py-3 px-4 text-base font-medium text-center flex items-center justify-center whitespace-normal ${
                              answers[question.id] === option.value ? "bg-primary/10 border-primary" : "hover:bg-muted"
                            }`}
                            onClick={() => handleAnswerSelect(question.id, option.value)}
                          >
                            <p>{option.label}</p>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <CardFooter className="flex justify-between p-6 border-t">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={current === 0}>
                Trước
              </Button>

              <div className="text-sm text-muted-foreground">
                Câu hỏi {current + 1} / {quizData.length}
              </div>

              {isLastQuestion ? (
                <Button type="submit" disabled={Object.keys(answers).length < quizData.length}>
                  Xác định loại da
                </Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Tiếp theo
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>

        {submitted && skinType && (
          <div id="results" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Kết quả của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Loại da của bạn:</h2>
                    <p className="text-lg mb-4">
                      Dựa trên câu trả lời của bạn, da của bạn có vẻ là{" "}
                      <span className="font-bold capitalize">{skinType}</span>.
                    </p>
                    <p className="text-base">{skinTypeDescriptions[skinType]}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Câu trả lời của bạn:</h3>
                    <div className="space-y-2">
                      {quizData.map((question) => (
                        <div key={question.id} className="border rounded-lg p-3">
                          <h4 className="font-medium">{question.question}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Câu trả lời:{" "}
                            {question.options.find((opt) => opt.value === answers[question.id])?.label ||
                              "Chưa trả lời"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 border-t">
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    setSkinType(null)
                    setAnswers({})
                    if (api) {
                      api.scrollTo(0)
                    }
                  }}
                  variant="outline"
                >
                  Làm lại bài kiểm tra
                </Button>
                <Button className="mt-4" onClick={() => setShowRoutine(true)}>Xem lộ trình chăm sóc</Button>
              </CardFooter>
            </Card>
          </div>
        )}
        {showRoutine && RoutineComponent && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Lộ trình chăm sóc:</h3>
                <RoutineComponent />
              </div>
            )}
      </div>
    </main>
  )
}

