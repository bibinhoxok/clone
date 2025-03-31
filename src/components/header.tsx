"use client"; // Đánh dấu component là Client Component

import Link from "next/link";
import { Leaf, ShoppingCart, User, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react"; // Import useRef
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession, signOut } from "next-auth/react";
import { SessionCustomer } from "@next-server-actions/types";
import { redirect, useRouter } from "next/navigation";


const link = [
  {
    title: "Trang Chủ",
    link: "/"
  },
  {
    title: "Cửa Hàng",
    link: "/skinstore-page"
  },
  {
    title: "Blog",
    link: "/blog-page"
  },
  {
    title: "Xác định loại da",
    link: "/quiz"
  },
]

const dropdown = [
  {
    title: "tài khoản",
    link: "/customer-detail"
  },
  {
    title: "Đơn mua",
    link: "/order"
  },
]



export default function Header() {
  const router = useRouter();
  const { status, data: session } = useSession();
  // State để kiểm soát dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Create a ref for the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý khi bấm vào biểu tượng Đăng Nhập
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className="relative" ref={dropdownRef}> {/* Attach the ref here */}
          <Button
            className="flex items-center justify-center w-8 hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
            onClick={toggleDropdown} // Bấm vào để toggle dropdown
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute flex flex-col w-max right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              <p className="px-4 py-2 text-sm">Hello, {(session?.user as SessionCustomer)?.name}!</p>
              <div className="border-t border-gray-300 mx-2"></div>
              {dropdown.map((item, index) => (
                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  href={item.link}
                  key={index}>
                  {item.title}
                </Link>
              ))}
              <Link href={"#"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  signOut({ redirect: false }).then(() => {
                    router.push("/")
                  });
                }}
              >Đăng xuất</Link>
            </div>
          )}
        </div>
      )
    } else if (status === "loading") {
      return (
        <span className="text-[#888] text-sm mt-7">Loading...</span>
      )
    } else {
      return (
        <div>
          <Button className="mx-2" variant={"outline"}>
            <Link
              href="/login"
            >
              Đăng Nhập
            </Link>
          </Button>
          <Button className="mx-2">
            <Link
              href="/signup"
            >
              Đăng kí
            </Link>
          </Button>
        </div>
      )
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 h-14 flex items-center">
      {/* Logo */}
      <Link className="flex items-center justify-center" href="/">
        <Leaf className="h-6 w-6" />
        <span className="sr-only">Chăm Sóc Da Glow</span>
      </Link>

      {/* Navigation */}
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">

        {/* Tìm kiếm và Button */}
        <div className="relative flex items-center">
          <Input
            type="text"
            className="text-sm px-4 py-1 h-8"
            placeholder="Tìm kiếm..."
          />
          {/* Button tìm kiếm với biểu tượng */}
          <Link href="/search">
            <Button
              type="button"
              className="absolute right-0 top-0 bottom-0 rounded-tl-none rounded-bl-none h-8 w-8 px-4 py-1"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        {/* Nút Trang Chủ */}
        {link.map((item, index) => (
          <Link
            className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
            href={item.link}
            key={index}>
            {item.title}
          </Link>
        ))}

        {/* Giỏ hàng */}
        <Link
          href="/shopping-cart"
          className="flex items-center justify-center hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Giỏ Hàng</span>
        </Link>

        {/* Dropdown menu cho Đăng Nhập */}
        {showSession()}


      </nav>
    </header>
  );
}
