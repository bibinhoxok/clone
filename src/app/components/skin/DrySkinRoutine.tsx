import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function DrySkinRoutine() {
  const steps = [
    {
      step: "Sữa rửa mặt dạng kem dưỡng ẩm",
      products: [
        { name: "Sữa rửa mặt X", image: "/images/cleanser_x.jpg", price: "250,000 VND", description: "Làm sạch nhẹ nhàng, giữ ẩm cho da." },
        { name: "Sữa rửa mặt Y", image: "/images/cleanser_y.jpg", price: "220,000 VND", description: "Nuôi dưỡng làn da mềm mại, không gây khô." },
        { name: "Sữa rửa mặt Z", image: "/images/cleanser_z.jpg", price: "280,000 VND", description: "Chiết xuất thiên nhiên, giúp da căng mịn." },
      ],
    },
    {
      step: "Toner cấp ẩm không cồn",
      products: [
        { name: "Toner X", image: "/images/toner_x.jpg", price: "300,000 VND", description: "Dưỡng ẩm, làm dịu da." },
        { name: "Toner Y", image: "/images/toner_y.jpg", price: "270,000 VND", description: "Cung cấp độ ẩm cần thiết cho da khô." },
        { name: "Toner Z", image: "/images/toner_z.jpg", price: "290,000 VND", description: "Chiết xuất tự nhiên, dưỡng ẩm sâu." },
      ],
    },
    {
      step: "Serum axit hyaluronic trên da ẩm",
      products: [
        { name: "Serum X", image: "/images/serum_x.jpg", price: "400,000 VND", description: "Giữ nước tối ưu, cấp ẩm sâu." },
        { name: "Serum Y", image: "/images/serum_y.jpg", price: "420,000 VND", description: "Tăng độ đàn hồi, giúp da săn chắc." },
        { name: "Serum Z", image: "/images/serum_z.jpg", price: "450,000 VND", description: "Cải thiện kết cấu da, chống lão hóa." },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quy Trình Chăm Sóc Da Khô</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Quy trình chăm sóc da khô giúp bổ sung độ ẩm, giữ da mềm mại và khỏe mạnh.</p>
        </CardContent>
      </Card>
      <div className="space-y-10">
        {steps.map((step, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold">{step.step}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {step.products.map((product, pIndex) => (
                <Card key={pIndex}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image src={product.image} alt={product.name} width={200} height={200} className="rounded-lg object-cover bg-gray-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><rect width="24" height="24" fill="#D1D5DB"/></svg>'} />
                    <p className="mt-2 font-semibold">{product.price}</p>
                    <p>{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
