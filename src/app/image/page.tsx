import Image from "next/image"
export default function home() {
    return (
    <div className="w-auto">
        <Image src="/images/anh-nen2.jpeg" alt="" sizes="(max-width: 768px)"
      width={500}
      height={500}/>
    </div>
    )
}