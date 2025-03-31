"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// Define the schema for the form
const FeedbackSchema = z.object({
  customer_id: z.string(),
  product_id: z.string(),
  rating: z.number().min(0).max(5).default(0),
  comment: z
    .string()
    .min(3, {
      message: "Comment must be at least 3 characters.",
    })
    .max(2000, {
      message: "Comment cannot exceed 2000 characters.",
    }),
  is_active: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
})

type FeedbackFormValues = z.infer<typeof FeedbackSchema>

interface RatingDialogProps {
  customerId: string
  productId: string
  productName: string
  onSubmit: (values: FeedbackFormValues) => void
}

export function RatingDialog({ customerId, productId, productName, onSubmit }: RatingDialogProps) {
  const [open, setOpen] = useState(false)

  // Default values for the form
  const defaultValues: Partial<FeedbackFormValues> = {
    customer_id: customerId,
    product_id: productId,
    rating: 0,
    comment: "",
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues,
  })

  function handleSubmit(values: FeedbackFormValues) {
    onSubmit(values)
    setOpen(false)
    form.reset(defaultValues)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Rate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rate Product</DialogTitle>
          <DialogDescription>Share your experience with "{productName}"</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          variant="ghost"
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              field.value >= star ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>Click on a star to rate from 1 to 5</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this product..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your comment should be between 3 and 2000 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

