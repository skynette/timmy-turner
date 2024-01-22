import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const address = useAddress()

    return (
        <div className='bg-black border-b border-gray-400 text-white'>
            <nav className='container w-5/6 mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-4 py-4 space-y-4'>
                <div className=''>
                    <Link href='/' className='text-2xl font-semibold'>TimmyTurner</Link>
                </div>
                {address && (
                    <div className=''>
                        <a href={`/profile/${address}`} className='hover:underline hover:underline-offset-4 transition-all'>My NFTs</a>
                    </div>
                )}
                <ConnectWallet />
            </nav>
        </div>
    )
}

export default Navbar