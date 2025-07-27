'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Navbar: React.FC = () => {

    const router = useRouter()
    return (
        <div className="sticky top-0 z-10 flex justify-between items-center py-6 border-b border-gray-300 bg-white">
            <div 
                className="text-3xl font-bold text-green-700 cursor-pointer"
                onClick={() => router.push("/")}
            >FINSTRA</div>
            <ul className="flex space-x-6 text-m font-medium ul">
                <li><Link href="/#about" className="underline-animate py-1">About</Link></li>
                <li><Link href="/#basic" className="underline-animate py-1">Basic</Link></li>
                <li><Link href="/#demo" className="underline-animate py-1 ">Demo</Link></li>
                <li><Link href="/#alert" className="underline-animate py-1">Alert</Link></li>
                <li><Link href="/#contact" className="underline-animate py-1">Contact</Link></li>
            </ul>
        </div>
    )
}

export default Navbar  
