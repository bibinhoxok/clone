"use client"
import {MoveLeft } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
const GoBackButton = () => {
    const router = useRouter()
    return(
    <Button variant="outline" className="no-print" onClick={()=>router.back()}> 
          <MoveLeft  className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
)}
export {GoBackButton}