import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import React from 'react'

const Navbar = () => {
    const address = useAddress()

    return (
        <div className='bg-black border-b border-gray-400 text-white'>
            <nav className='container w-5/6 mx-auto flex items-center justify-between px-4 py-4'>
                <div className=''>
                    <h1 className='text-2xl font-semibold'>TimmyTurner</h1>
                </div>
                {address && (
                    <div className='space-x-2 flex items-center'>
                        <a href={`/profile/${address}`} className=''>My NFTs</a>
                    </div>
                )}
                <ConnectWallet />
            </nav>
        </div>
    )
}

export default Navbar