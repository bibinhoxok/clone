
import type { Metadata } from "next"
export const metadata: Metadata = {
  title:"Đăng nhập"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (<>{children}</>)
}

