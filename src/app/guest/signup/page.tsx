"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Patterns for validation
const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const NAME = /^[a-zA-ZÀ-ỹ\s]+$/;
const PHONE_NUMBER = /^[0-9]{10}$/;

export default function SignupPage() {
  const router = useRouter();
  const [formStep, setFormStep] = useState("basic");
  interface Location {
    id: string;
    name: string;
  }

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === "object" && Array.isArray(data.data)) {
          setProvinces(data.data);
        }
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            setDistricts(data.data);
          }
        })
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            setWards(data.data);
          }
        })
        .catch((error) => console.error("Error fetching wards:", error));
    }
  }, [selectedDistrict]);

  const handleNextStep = async () => {
    const result = await trigger([
      "lastName",
      "firstName",
      "username",
      "password",
      "confirmPassword",
      "email",
      "phoneNumber",
    ]);
    if (result) {
      setFormStep("address");
    }
  };

  const onSubmit = async (data: any) => {
    // Here you would typically call your API to register the user
    console.log(data);
    // Redirect to login page after successful signup
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Đăng Ký
          </CardTitle>
          <CardDescription className="text-center">
            {formStep === "basic"
              ? "Đăng ký ngay để nhận nhiều ưu đãi"
              : "Nhập thông tin địa chỉ (Bạn có thể bỏ qua và cập nhật sau)"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {formStep === "basic" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Họ</Label>
                  <Input
                    id="lastName"
                    {...register("lastName", {
                      required: "Họ là bắt buộc",
                      pattern: { value: NAME, message: "Họ không hợp lệ" },
                    })}
                  />
                  {errors.lastName?.message && (
                    <p className="text-red-500 text-sm">
                      {String(errors.lastName.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Tên</Label>
                  <Input
                    id="firstName"
                    {...register("firstName", {
                      required: "Tên là bắt buộc",
                      pattern: { value: NAME, message: "Tên không hợp lệ" },
                    })}
                  />
                  {errors.firstName?.message && (
                    <p className="text-red-500 text-sm">
                      {String(errors.firstName.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    {...register("username", {
                      required: "Tên đăng nhập là bắt buộc",
                      minLength: {
                        value: 5,
                        message: "Tên đăng nhập phải có ít nhất 5 ký tự",
                      },
                    })}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {String(errors.username.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 5,
                        message: "Mật khẩu phải có ít nhất 5 ký tự",
                      },
                    })}
                  />
                  {errors.password?.message && (
                    <p className="text-red-500 text-sm">
                      {String(errors.password.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Xác nhận mật khẩu là bắt buộc",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Mật khẩu không khớp",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {String(errors.confirmPassword.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email là bắt buộc",
                      pattern: { value: EMAIL, message: "Email không hợp lệ" },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {String(errors.email.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber", {
                      required: "Số điện thoại là bắt buộc",
                      pattern: {
                        value: PHONE_NUMBER,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">
                      {String(errors.phoneNumber.message)}
                    </p>
                  )}
                </div>
              </>
            )}
            {formStep === "address" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh thành</Label>
                  <Select
                    onValueChange={(value: string) =>
                      setSelectedProvince(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh thành" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Select
                    onValueChange={(value: string) =>
                      setSelectedDistrict(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Select
                    onValueChange={(value: string) => setSelectedWard(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Số nhà</Label>
                  <Input
                    id="homeAddress"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {formStep === "basic" && (
              <Button type="button" onClick={handleNextStep} className="w-full">
                Tiếp theo
              </Button>
            )}
            {formStep === "address" && (
              <>
                <Button type="submit" className="w-full">
                  Đăng ký
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormStep("basic")}
                  className="w-full"
                >
                  Quay lại
                </Button>
              </>
            )}
            <div className="text-center space-y-2">
              <Link href="/guest/login" className="text-sm hover:underline">
                Quay lại đăng nhập nếu bạn đã có tài khoản
              </Link>
              <Link href="/guest" className="text-sm hover:underline block">
                Trở về trang chủ
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
