"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import DrySkinRoutine from "@/components/skin/DrySkinRoutine"
import NormalSkinRoutine from "@/components/skin/NormalSkinRoutine"
import OilySkinRoutine from "@/components/skin/OilySkinRoutine"
import CombinationSkinRoutine from "@/components/skin/CombinationSkinRoutine"

// Import các component tương ứng với từng loại da


const questions = [
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

export default function SkinTypeQuiz() {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [result, setResult] = useState<string | null>(null)
    const [showRoutine, setShowRoutine] = useState(false)
  
    const handleAnswer = (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }))
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
      const skinType = determineSkinType()
      setResult(skinType)
      setShowRoutine(false) // Đặt lại trạng thái của lộ trình khi có kết quả mới
    }
  
    const routineComponents: Record<string, React.FC> = {
      "da khô": DrySkinRoutine,
      "da thường": NormalSkinRoutine,
      "da dầu": OilySkinRoutine,
      "da hỗn hợp": CombinationSkinRoutine,
    }
  
    const RoutineComponent = result ? routineComponents[result] : null
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Trắc nghiệm loại da</h1>
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div key={q.id} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{q.question}</h2>
              <RadioGroup onValueChange={(value) => handleAnswer(q.id, value)} value={answers[q.id]}>
                {q.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                    <Label htmlFor={`${q.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button type="submit" className="mt-4">Xác định loại da của tôi</Button>
        </form>
  
        {result && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Loại da của bạn:</h2>
            <p className="text-lg">
              Dựa trên câu trả lời của bạn, da của bạn có vẻ là <span className="font-bold capitalize">{result}</span>.
            </p>
  
            {/* Nút bấm hiển thị lộ trình */}
            <Button className="mt-4" onClick={() => setShowRoutine(true)}>Xem lộ trình chăm sóc</Button>
  
            {/* Chỉ hiển thị lộ trình khi người dùng bấm nút */}
            {showRoutine && RoutineComponent && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Lộ trình chăm sóc:</h3>
                <RoutineComponent />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  