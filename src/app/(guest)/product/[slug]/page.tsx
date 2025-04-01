
import ProductDetails from "@/components/product-detail"
import Test from "./test"

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  
  const { slug } = await params
  if(typeof slug === "string") return(<ProductDetails id={slug}/>)
  else return <>loading</>
}

