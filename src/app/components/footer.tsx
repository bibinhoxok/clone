import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t bg-black text-white">
      <section className="w-full py-8 bg-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 lg:grid-cols-1 lg:gap-8 xl:grid-cols-2">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Về Chúng Tôi"
              className="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
              width={400}
              height={300}
            />
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-2xl font-semibold sm:text-3xl">Về Chúng Tôi</h2>
              <p className="max-w-[500px] md:text-lg lg:text-base dark:text-gray-400">
                Chúng tôi tin tưởng vào sức mạnh của thiên nhiên trong việc cải thiện làn da. Các sản phẩm của chúng tôi được chế tác cẩn thận, chỉ sử dụng các thành phần tự nhiên tốt nhất để nuôi dưỡng và tái tạo làn da của bạn.
              </p>
              <Button className="w-fit text-sm">Tìm Hiểu Thêm</Button>
            </div>
          </div>
        </div>
      </section>

      <p className="text-xs">
        © 2024 Chăm Sóc Da Glow. Mọi quyền được bảo lưu.
      </p>

      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Điều Khoản Dịch Vụ
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Chính Sách Bảo Mật
        </Link>
      </nav>

      <div className="flex gap-4 sm:ml-6 mt-2">
        <Link href="#" className="text-white hover:text-blue-500">
          <Facebook className="h-4 w-4" />
        </Link>
        <Link href="#" className="text-white hover:text-pink-500">
          <Instagram className="h-4 w-4" />
        </Link>
        <Link href="#" className="text-white hover:text-blue-400">
          <Twitter className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
