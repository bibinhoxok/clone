"use client"; // Đánh dấu component là Client Component

import Link from "next/link";
import { Leaf, ShoppingCart, User, Search } from "lucide-react";
import { useState } from "react"; // Import useState để quản lý state

export default function Header() {
  // State để kiểm soát dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hàm xử lý khi bấm vào biểu tượng Đăng Nhập
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      {/* Logo */}
      <Link className="flex items-center justify-center" href="/">
        <Leaf className="h-6 w-6" />
        <span className="sr-only">Chăm Sóc Da Glow</span>
      </Link>

      {/* Navigation */}
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {/* Nút Trang Chủ */}
        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest"
        >
          Trang Chủ
        </Link>

        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest/skinstore-page"
        >
          Cửa Hàng
        </Link>
        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest/blog-page"
        >
          Blog
        </Link>
        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest/dictionary-page"
        >
          Từ Điển
        </Link>

        {/* Tìm kiếm và Button */}
        <div className="relative flex items-center">
          <input
            type="text"
            className="text-sm px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-100"
            placeholder="Tìm kiếm..."
          />
          {/* Button tìm kiếm với biểu tượng */}
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 px-4 py-1 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Giỏ hàng */}
        <Link
          href="#"
          className="flex items-center justify-center hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Giỏ Hàng</span>
        </Link>

        {/* Dropdown menu cho Đăng Nhập */}
        <div className="relative">
          <button
            className="flex items-center justify-center hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
            onClick={toggleDropdown} // Bấm vào để toggle dropdown
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Đăng Nhập</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              <Link
                href="/guest/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/guest/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
