import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, ShoppingCart, User } from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
    <Header/>
       
      <main className="flex-1 bg-[url('/background-image.jpg')] bg-cover bg-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 bg-cover bg-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Làn Da Rạng Rỡ, Tự Nhiên
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Khám phá dòng sản phẩm chăm sóc da tự nhiên của chúng tôi để có làn da khỏe mạnh và rạng ngời.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Mua Ngay</Button>
                <Button variant="outline">Tìm Hiểu Thêm</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full flex justify-center mt-4">
          <div className="w-2/3 relative mb-2">
            <Image
              src="/images/anh-nen2.jpeg"
              alt="Sản phẩm nổi bật"
              className="w-full h-[500px] object-cover rounded-lg"
              width={6000}
              height={2000}
            />
          </div>
        </div>

        {/* Sản phẩm nổi bật */}
        <section className="w-full py-12 bg-gray-50 flex justify-center items-center">
          <div className="border border-gray-300 rounded-lg p-4 bg-black max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-center mb-6 text-white">
              Sản Phẩm Nổi Bật
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="flex-shrink-0 w-full bg-white">
                  <CardContent className="p-3">
                    <Image
                      src={`/placeholder.svg?height=180&width=180`}
                      alt={`Sản Phẩm Nổi Bật ${i}`}
                      className="rounded-lg object-cover w-full aspect-square mb-4 cursor-pointer"
                      width={150}
                      height={150}
                    />
                    <h3 className="font-semibold text-md mb-2 cursor-pointer">
                      Sản Phẩm Nổi Bật {i}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Mô tả ngắn gọn về sản phẩm nổi bật {i}.
                    </p>
                    <Button className="w-full text-sm">Thêm Vào Giỏ</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full flex justify-center mt-4">
          <div className="w-2/3 relative mb-4">
            <Image
              src="/images/anh-nen5.jpeg"
              alt="Sản phẩm nổi bật"
              className="w-full h-[500px] object-cover rounded-lg"
              width={6000}
              height={2000}
            />
          </div>
        </div>

        {/* Phần hiển thị tất cả sản phẩm */}
        <section className="w-full py-12 bg-white flex justify-center items-center">
          <div className="border border-gray-300 rounded-lg p-4 bg-black max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-center mb-6 text-white">
              Tất Cả Sản Phẩm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="flex-shrink-0 w-full bg-white">
                  <CardContent className="p-3">
                    <Image
                      src={`/placeholder.svg?height=180&width=180`}
                      alt={`Sản Phẩm ${i}`}
                      className="rounded-lg object-cover w-full aspect-square mb-4 cursor-pointer"
                      width={150}
                      height={150}
                    />
                    <h3 className="font-semibold text-md mb-2 cursor-pointer">
                      Tên Sản Phẩm {i}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Mô tả ngắn gọn về sản phẩm {i}.
                    </p>
                    <Button className="w-full text-sm">Thêm Vào Giỏ</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      
        
      </main>
      <Footer /> {/* Gọi Footer */}
    </div>
  );
}
