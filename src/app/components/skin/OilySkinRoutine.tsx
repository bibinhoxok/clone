import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function OilySkinRoutine() {
  const steps = [
    {
      step: "Sữa rửa mặt tạo bọt dịu nhẹ",
      products: [
        { name: "Sữa rửa mặt A", image: "/images/cleanser_a.jpg", price: "250,000 VND", description: "Làm sạch sâu, kiểm soát dầu thừa." },
        { name: "Sữa rửa mặt B", image: "/images/cleanser_b.jpg", price: "220,000 VND", description: "Cấp ẩm nhẹ, không gây khô da." },
        { name: "Sữa rửa mặt C", image: "/images/cleanser_c.jpg", price: "280,000 VND", description: "Chiết xuất thiên nhiên, lành tính." },
      ],
    },
    {
      step: "Toner cân bằng không cồn",
      products: [
        { name: "Toner A", image: "/images/toner_a.jpg", price: "300,000 VND", description: "Se khít lỗ chân lông, kiểm soát dầu." },
        { name: "Toner B", image: "/images/toner_b.jpg", price: "270,000 VND", description: "Cấp ẩm nhẹ, giúp da mềm mịn." },
        { name: "Toner C", image: "/images/toner_c.jpg", price: "290,000 VND", description: "Chiết xuất trà xanh, kháng khuẩn tốt." },
      ],
    },
    {
      step: "Serum nhẹ, không chứa dầu",
      products: [
        { name: "Serum A", image: "/images/serum_a.jpg", price: "400,000 VND", description: "Giảm dầu nhờn, giúp da sáng mịn." },
        { name: "Serum B", image: "/images/serum_b.jpg", price: "420,000 VND", description: "Thẩm thấu nhanh, không bết dính." },
        { name: "Serum C", image: "/images/serum_c.jpg", price: "450,000 VND", description: "Chống oxy hóa, dưỡng da khỏe mạnh." },
      ],
    },
    {
      step: "Kem dưỡng ẩm dạng gel hoặc không chứa dầu",
      products: [
        { name: "Kem dưỡng A", image: "/images/moisturizer_a.jpg", price: "350,000 VND", description: "Dưỡng ẩm nhẹ, không gây bít tắc lỗ chân lông." },
        { name: "Kem dưỡng B", image: "/images/moisturizer_b.jpg", price: "370,000 VND", description: "Kết cấu gel mát, dễ thẩm thấu." },
        { name: "Kem dưỡng C", image: "/images/moisturizer_c.jpg", price: "390,000 VND", description: "Bổ sung độ ẩm, kiểm soát dầu tốt." },
      ],
    },
    {
      step: "Mặt nạ đất sét (1-2 lần/tuần)",
      products: [
        { name: "Mặt nạ A", image: "/images/mask_a.jpg", price: "200,000 VND", description: "Hút dầu thừa, làm sạch sâu lỗ chân lông." },
        { name: "Mặt nạ B", image: "/images/mask_b.jpg", price: "220,000 VND", description: "Cân bằng da, giảm bóng nhờn." },
        { name: "Mặt nạ C", image: "/images/mask_c.jpg", price: "250,000 VND", description: "Thành phần thiên nhiên, lành tính cho da." },
      ],
    },
    {
      step: "Kem chống nắng không chứa dầu SPF 30+",
      products: [
        { name: "Kem chống nắng A", image: "/images/sunscreen_a.jpg", price: "320,000 VND", description: "Bảo vệ da khỏi tia UV, không gây nhờn rít." },
        { name: "Kem chống nắng B", image: "/images/sunscreen_b.jpg", price: "340,000 VND", description: "Kiềm dầu tốt, giữ da khô thoáng cả ngày." },
        { name: "Kem chống nắng C", image: "/images/sunscreen_c.jpg", price: "360,000 VND", description: "Chống nắng phổ rộng, dưỡng ẩm nhẹ." },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quy Trình Chăm Sóc Da Dầu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Quy trình chăm sóc da dầu giúp kiểm soát dầu thừa, giảm bóng nhờn và giữ da luôn sạch sẽ, khỏe mạnh.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Các Bước Quy Trình</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((step, index) => (
              <li key={index}>{step.step}</li>
            ))}
          </ol>
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