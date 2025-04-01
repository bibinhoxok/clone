"use client";
import Image from "next/image";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { zProductSchemaUdate } from "@/schemas/productSchema";
import { useToast } from "@/lib/custom-hooks";
import AddToCartButton from "./AddToCartButton";
import { z } from "zod";

// Define a more specific type for the product data based on the response
type ProductData = z.infer<typeof zProductSchemaUdate> & {
  feedbacks?: {
    name: string;
    time: string;
    rating: number;
    title: string;
    comment: string;
  }[];
};

const ProductDetails = ({ id }: { id: string }) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v2/product/id?id=${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        const parsedData = data 
        if (!parsedData.success) {
          throw new Error(`Failed to parse product data: ${parsedData.error.message}`);
        }
        setProduct(parsedData.data);
      } catch (err: any) {
        setError(err.message);
        useToast(err.message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4">Error: {error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto py-8 px-4">Product not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 aspect-square relative">
              <Image
                src={product.image_url || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                width={600}
                height={600}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.feedbacks?.length || 0} customer reviews)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Price</h2>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">${product.price} USD</span>
              </div>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  className="w-16 text-center rounded-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <AddToCartButton product={{...product, quantity}}/>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <span className="text-5xl font-bold">4.5</span>
                  <p className="text-sm text-muted-foreground">
                    based on {product.feedbacks?.length || 0} ratings
                  </p>
                  <div className="flex justify-center md:justify-start mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                    <Star
                      className="w-5 h-5 fill-primary text-primary"
                      fill="url(#half-star)"
                    />
                  </div>
                </div>

                {[
                  { stars: 5, count: 661 },
                  { stars: 4, count: 237 },
                  { stars: 3, count: 76 },
                  { stars: 2, count: 19 },
                  { stars: 1, count: 39 },
                ].map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-2">
                    <span className="w-3">{rating.stars}</span>
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(rating.count / 1032) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {rating.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2 space-y-6">
                {product.feedbacks?.map((review, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs">
                            {review.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(review.rating)
                                ? "fill-primary text-primary"
                                : i < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="font-medium mt-3">{review.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="descriptions">
            <div className="prose max-w-none">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* SVG Definitions for half star */}
      <svg width="0" height="0" className="hidden">
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
export default ProductDetails;
