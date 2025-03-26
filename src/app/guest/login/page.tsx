"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "user@example.com" && password === "password") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  const onSuccess = async (response: any) => {
    try {
      const userObject = jwtDecode(response.credential);
      console.log("Google User:", userObject);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">ĐĂNG NHẬP</CardTitle>
          <CardDescription>CHÀO MỪNG ĐẾN VỚI CỬA HÀNG ...</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật Khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Đăng Nhập
            </Button>
          </CardFooter>
        </form>
        <div className="flex justify-between text-sm text-gray-600 mt-4 px-6">
          <Link href="/forgot" className="hover:underline">
            Quên mật khẩu?
          </Link>
          <Link href="/guest/signup" className="hover:underline">
            Đăng ký ngay
          </Link>
        </div>
        <div className="flex items-center my-6 px-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => console.error("Google Login Failed")}
          />
        </GoogleOAuthProvider>
        <div className="text-center mt-4 px-6">
          <Link href="/guest" className="text-gray-600 hover:underline">
            Trở về trang chủ
          </Link>
        </div>
      </Card>
    </div>
  );
}
