import Image from "next/image"
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  console.log(slug)
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 aspect-square relative">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Oculus VR Headset"
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
            <h1 className="text-3xl font-bold">Oculus VR</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star  key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">(449 customer reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-3">Select Your Oculus</h2>
              <div className="grid grid-cols-3 gap-4">
                {["Oculus Go", "Oculus Quest", "Oculus Rift S"].map((model) => (
                  <Card key={model} className="cursor-pointer hover:border-primary">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="h-24 w-24 relative mb-2">
                        <Image
                          src="/placeholder.svg?height=96&width=96"
                          alt={model}
                          width={96}
                          height={96}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm text-center">{model}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Select Color</h2>
              <RadioGroup defaultValue="white" className="flex gap-2">
                {[
                  { value: "white", label: "White", color: "bg-[#f8f8f8] border" },
                  { value: "pink", label: "Pink", color: "bg-pink-200" },
                  { value: "black", label: "Black", color: "bg-gray-800" },
                ].map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                    <Label htmlFor={`color-${color.value}`} className="cursor-pointer flex flex-col items-center">
                      <span className={`w-8 h-8 rounded-full ${color.color}`}></span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Price</h2>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">$ 149 USD</span>
                <span className="text-xl text-muted-foreground line-through">$ 179 USD</span>
              </div>
            </div>

            <p className="text-muted-foreground">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button variant="outline" size="icon" className="rounded-r-none">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="number" min="1" defaultValue="1" className="w-16 text-center rounded-none" />
                <Button variant="outline" size="icon" className="rounded-l-none">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                Add to Wishlist
              </Button>
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
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <span className="text-5xl font-bold">4.5</span>
                  <p className="text-sm text-muted-foreground">based on 1,032 ratings</p>
                  <div className="flex justify-center md:justify-start mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                    <Star className="w-5 h-5 fill-primary text-primary" fill="url(#half-star)" />
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
                    <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2 space-y-6">
                {[
                  {
                    name: "Joan Dyer",
                    time: "3 hours ago",
                    rating: 4.5,
                    title: "Top-Oculus VR",
                    comment:
                      "A good fit for many households, this Oculus VR has a movable deli drawer and door shelves that can accommodate gallon containers. Though its low price means fewer features, this pick is quiet and an energy-saving option, resulting in a lower energy bill.",
                  },
                  {
                    name: "Phil Glover",
                    time: "1 day ago",
                    rating: 5,
                    title: "Oculus VR Full 3D",
                    comment:
                      "I purchased this Oculus from elsewhere, on last Diwali. As this Oculus contains in-built DDR, means you need not to install a separate set-top box).",
                  },
                ].map((review, index) => (
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
                          <p className="text-sm text-muted-foreground">{review.time}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(review.rating) ? "fill-primary text-primary" : i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="font-medium mt-3">{review.title}</h3>
                    <p className="mt-2 text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="descriptions">
            <div className="prose max-w-none">
              <h3>Product Description</h3>
              <p>
                Experience virtual reality like never before with the Oculus VR headset. Immerse yourself in stunning 3D
                environments, play games, watch movies, and connect with friends in virtual spaces.
              </p>
              <h4>Features:</h4>
              <ul>
                <li>High-resolution display for immersive visuals</li>
                <li>Comfortable design for extended wear</li>
                <li>Intuitive controllers for natural interaction</li>
                <li>Access to a vast library of VR content</li>
                <li>No PC or console required (standalone device)</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="about">
            <div className="prose max-w-none">
              <h3>About Oculus</h3>
              <p>
                Oculus is a brand of Meta Platforms (formerly Facebook, Inc.) that produces virtual reality headsets,
                including the Oculus Rift, Oculus Quest, and Oculus Go lines.
              </p>
              <p>
                Founded in 2012, Oculus was acquired by Facebook in 2014 and has since become one of the leading
                innovators in the virtual reality space, making VR technology more accessible to consumers worldwide.
              </p>
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
  )
}

