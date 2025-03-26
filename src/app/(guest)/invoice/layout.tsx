import type { Metadata } from 'next'
export async function generateMetadata(): Promise<Metadata>  {
  return {
  title: 'Hóa đơn',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <>
      { children }
    </>
  )
}
