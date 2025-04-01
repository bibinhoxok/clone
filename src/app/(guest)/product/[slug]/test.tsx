
"use client"

import { useEffect, useState } from "react"

export default function Test({id}: {id: string}) {
    const [data, setData] = useState("")
    useEffect(() => {
        const fetchData = async () => {

            const res = await fetch(`/api/v2/product/id?id=${id}`)
            const data = await res.json()
            setData(JSON.stringify(data))
        }
        fetchData()
    }, [])

    return (<>{data}</>)
}