

import FeaturedProducts from "@/app/components/featurer-products"
import Footer from "@/app/components/footer"
import Header from "@/app/components/header"

export default function SkinStorePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <FeaturedProducts/>
      <Footer/>
    </main>
  )
}

