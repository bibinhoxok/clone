"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Review {
    rating: number;
    comment: string;
}

export default function ProductDetail() {
    const [selectedModel, setSelectedModel] = useState("oculus-go");
    const [selectedColor, setSelectedColor] = useState("gray");
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch("localhost:3000/api/feedback");
                const data: Review[] = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }
        fetchReviews();
    }, []);

    const submitReview = async () => {
        if (!comments.trim()) return;
        try {
            const response = await fetch("localhost:3000/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment: comments })
            });
            if (response.ok) {
                const newReview: Review = await response.json();
                setReviews([...reviews, newReview]);
                setComments("");
                setRating(0);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center bg-black text-white py-4 rounded-lg">Product Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="w-full h-[500px] bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
                    <Image src="https://via.placeholder.com/500" alt="Product Image" width={500} height={500} className="object-cover" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Oculus VR</h3>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={i < 4 ? "text-yellow-400" : "text-gray-400"} />
                        ))}
                        <span className="text-gray-500 text-sm">(449 customer reviews)</span>
                    </div>
                    <h4 className="font-semibold mt-4">Price</h4>
                    <p className="text-xl font-bold">$149 USD <span className="line-through text-gray-500 ml-2">$179 USD</span></p>
                    <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                        <span>{quantity}</span>
                        <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>+</Button>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" className="flex items-center gap-1">
                            <Heart className="w-4 h-4" /> Add to Wishlist
                        </Button>
                        <Button className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
            
            <Tabs defaultValue="reviews" className="mt-8">
                <TabsList>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                <TabsContent value="reviews">
                    <h4 className="font-semibold mt-4">Customer Reviews</h4>
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index} className="border-b py-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="text-yellow-400" />
                                    ))}
                                </div>
                                <p>{review.comment}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                        {[...Array(5)].map((_, i) => (
                            <button key={i} onClick={() => setRating(i + 1)}>
                                <Star className={i < rating ? "text-yellow-400" : "text-gray-400"} />
                            </button>
                        ))}
                        <span className="ml-2">{rating} / 5</span>
                    </div>
                    <Textarea className="mt-4" placeholder="Write a review..." value={comments} onChange={(e) => setComments(e.target.value)} />
                    <Button className="mt-4" onClick={submitReview}>Submit Review</Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}
