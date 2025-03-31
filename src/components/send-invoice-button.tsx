"use client"
import { Send } from "lucide-react"
import { Button } from "./ui/button"
const SendInvoiceButton = () => (
    <Button className="no-print">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
)
export {SendInvoiceButton}