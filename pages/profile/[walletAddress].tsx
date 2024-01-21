import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react"
import { CONTRACT_ADDRESS } from "../../const/addresses"

function truncateAddress(address: string) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

const ProfilePage = () => {
    const address = useAddress()
    const {
        contract
    } = useContract(CONTRACT_ADDRESS)

    const {
        data: ownedNFTs,
        isLoading: isOwnedNFTsLoading,
    } = useOwnedNFTs(contract, address)

    return (
        <div className="container mx-auto px-6">
            {address ? (
                <div>
                    <div className="pt-2">
                        <h1 className="text-3xl font-bold">Profile</h1>
                        <p className="font-semibold">Wallet Address: {truncateAddress(address || '')}</p>
                    </div>
                    <hr />
                    <div className="mt-4">
                        <h3 className="text-3xl font-semibold mb-4">My NFTs</h3>
                        <div className="">
                            {!isOwnedNFTsLoading ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {
                                        ownedNFTs && ownedNFTs?.length > 0 ? (
                                            ownedNFTs?.map((nft) => (
                                                <div key={nft.metadata.id} className="bg-gray-800 rounded-md">
                                                    <ThirdwebNftMedia
                                                        height="250px"
                                                        metadata={nft.metadata}
                                                    />
                                                    <h3 className="px-4 pb-2 text-xl font-bold">#{nft.metadata.name}</h3>
                                                    <h3 className="px-4 pb-2 text-sm">{nft.metadata.description}</h3>
                                                </div>
                                            ))
                                        ) : (
                                            <div>No NFTs Available</div>
                                        )
                                    }
                                </div>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    Connect your wallet to view your profile
                </div>
            )
            }
        </div >
    )
}

export default ProfilePage