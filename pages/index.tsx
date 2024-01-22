import { MediaRenderer, useActiveClaimConditionForWallet, useAddress, useClaimIneligibilityReasons, useContract, useContractMetadata, useContractRead, useTotalCirculatingSupply, useTotalCount } from "@thirdweb-dev/react";
import { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

const Home: NextPage = () => {
    const address = useAddress()
    const [claimQty, setclaimQty] = useState(1);

    const handleIncrease = () => {
        if (claimQty < maxClaimable) {
            setclaimQty(claimQty + 1);
        }
    };

    const handleDecrease = () => {
        if (claimQty > 1) {
            setclaimQty(claimQty - 1);
        }
    };

    const { contract } = useContract(CONTRACT_ADDRESS)
    const {
        data: contractMetadata,
        isLoading: isContractMetadataLoading
    } = useContractMetadata(contract);

    const {
        data: activeClaimPhase,
        isLoading: isActiveClaimPhaseLoading,
    } = useActiveClaimConditionForWallet(contract, address);

    const {
        data: totalSupply,
        isLoading: isTotalSupplyLoading,
    } = useTotalCount(contract);

    const {
        data: totalClaimed,
        isLoading: isTotalClaimedLoading,
    } = useTotalCirculatingSupply(contract);

    const {
        data: claimedByWallet,
        isLoading: isClaimedByWalletLoading,
    } = useContractRead(contract, "balanceOf", [address ?? ""])

    const maxClaimable = parseInt(activeClaimPhase?.maxClaimablePerWallet ?? "0");

    const {
        data: claimIneligiblity,
        isLoading: isClaimIneligiblityLoading,
    } = useClaimIneligibilityReasons(
        contract,
        {
            walletAddress: address ?? "",
            quantity: claimQty,
        }
    );

    const [loading, setLoading] = useState(false);

    // function to claim a certain amount of NFTs
    const claim = async (claimQty: number) => {
        if (contract) {
            try {
                setLoading(true);
                await contract.erc721.claim(claimQty);
                alert("Claimed!");
                console.log("Claimed!");
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="py-10 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg p-8 w-[80%]">
                {!isContractMetadataLoading && (
                    <div className="flex flex-col space-y-5 md:flex-row items-center space-x-5">
                        <div className="rounded-lg w-fit">
                            {/* image here */}
                            <MediaRenderer
                                src={contractMetadata?.image}

                            />
                        </div>

                        {/* title of contract */}
                        <div className="flex flex-col space-y-4 md:max-w-[60%]">
                            <h1 className="text-3xl font-bold">{contractMetadata?.name}</h1>
                            <p className="text-wrap">{contractMetadata?.description}</p>
                            {
                                !isActiveClaimPhaseLoading ? (
                                    <div>
                                        <p>Claim Phase: {activeClaimPhase?.metadata?.name}</p>
                                        <p>Price: {ethers.utils.formatUnits(activeClaimPhase?.price!)} ETH</p>
                                    </div>
                                ) : (
                                    <div>
                                        {/* loading pulse */}
                                        Please wait...
                                    </div>
                                )
                            }
                            {
                                !isTotalSupplyLoading && !isTotalClaimedLoading ? (
                                    <p>Total Claimed: {totalClaimed?.toNumber()} / {totalSupply?.toNumber()}</p>

                                ) : (
                                    <div>Loading</div>
                                )
                            }
                            {
                                address ?
                                    !isClaimIneligiblityLoading ? (
                                        claimIneligiblity?.length! > 0 ? (
                                            claimIneligiblity?.map((reason) => (
                                                <p key={reason}>{reason}</p>
                                            ))
                                        ) : (
                                            <div className="flex flex-col space-y-2">
                                                <p>You have claimed {parseInt(claimedByWallet ?? "0")} out of {maxClaimable}</p>
                                                <div className="flex items-center space-x-10">
                                                    <div className="flex items-center">
                                                        <button className="bg-white rounded-sm text-black py-1 px-3 w-fit" onClick={handleDecrease}>
                                                            -
                                                        </button>
                                                        <input
                                                            className="bg-gray-600 text-center outline-none py-1 px-3 w-[60px]"
                                                            type="number"
                                                            value={claimQty}
                                                            min={1}
                                                            max={maxClaimable}
                                                            readOnly
                                                        />
                                                        <button className="bg-white rounded-sm text-black py-1 px-3 w-fit" onClick={handleIncrease}>
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => claim(claimQty)}
                                                        className={`bg-white rounded-md font-semibold text-black py-1 px-5 w-fit ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <p className="flex items-center">
                                                                <svg className="mr-2 h-5 w-5 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                                {' '}Claiming...
                                                            </p>
                                                        ) : (
                                                            'Claim NFT'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <p>Loading...</p>
                                    ) : (
                                        <p>Connect your wallet</p>
                                    )
                            }
                        </div>
                    </div>
                )}
            </div>
        </main >
    );
};

export default Home;
