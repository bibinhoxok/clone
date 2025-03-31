import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  { id: 1, name: "Hydrating Serum", price: 49.99, image: "" },
  { id: 2, name: "Gentle Cleanser", price: 24.99, image: "" },
  { id: 3, name: "Moisturizing Cream", price: 39.99, image: "" },
  { id: 4, name: "Exfoliating Scrub", price: 34.99, image: "" },
];

export default function FeaturedProducts() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="shadow-lg border border-gray-200">
            <CardHeader className="p-0">
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center overflow-hidden rounded-t-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
              <p className="text-lg font-semibold mt-2">${product.price}</p>
            </CardContent>
            <CardFooter className="p-4">
              <Button className="w-full bg-black text-white hover:bg-gray-800">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
