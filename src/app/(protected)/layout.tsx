import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import React from 'react'

const ProtectedLayout = ({children}: {children:React.ReactNode}) => {
    const router = useRouter();
    const pathname = usePathname();

  return (
    <>
    {children}
    </>
  )
}

export default ProtectedLayout