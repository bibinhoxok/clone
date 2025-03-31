"use client"
import { Printer } from "lucide-react"
import { Button } from "./ui/button"
const PrintButton = () => (
    <Button variant="outline" className="no-print" onClick={()=>window.print()}> 
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
)
export {PrintButton}