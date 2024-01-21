import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import Navbar from "../components/navbar";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = Sepolia;

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThirdwebProvider
            clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
            activeChain={activeChain}
        >
            <Navbar />
            <div className="bg-gray-950 text-white h-screen">
                <Component {...pageProps} />
            </div>
        </ThirdwebProvider>
    );
}

export default MyApp;
