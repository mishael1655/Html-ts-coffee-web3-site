// This code is a TypeScript version of the original JavaScript code for interacting with an Ethereum smart contract.
import { 
    createWalletClient, 
    custom, 
    createPublicClient, 
    parseEther, 
    defineChain, 
    formatEther,
    WalletClient,
    PublicClient,
    Chain,
    Address,
    Hash
} from "viem";
import "viem/window"
import { contractAddress, abi } from "./constant-ts.ts"

// Type definitions for Ethereum window object
// (Removed custom Window.ethereum declaration to avoid conflict with viem types)

// Type definitions for DOM elements
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;
const getAddressToAmountFundedButton = document.getElementById("getAddressToAmountFunded") as HTMLButtonElement;

console.log("TypeScript version of the Ethereum interaction script loaded.");

// Global client variables with proper typing
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

async function connect(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses();
        connectButton.innerHTML = "connected!";
    } else {
        connectButton.innerHTML = "pls install metamask!";
    }
}

async function fund(): Promise<void> {
    const ethAmount: string = ethAmountInput.value;
    console.log("Funding with amount:", ethAmount);
    
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        
        const [connectedAccount]: Address[] = await walletClient.requestAddresses();
        const currentChain: Chain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        
        const { request } = await publicClient.simulateContract({
            address: contractAddress as Address,
            abi: abi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount),
        });

        const hash: Hash = await walletClient.writeContract(request);
        console.log("Transaction processed:", hash);
        alert(`Transaction sent! Hash: ${hash}`);
    } else {
        fundButton.innerHTML = "pls install metamask!";
    }
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
    const chainId: number = await client.getChainId();
    const currentChain: Chain = defineChain({
        id: chainId,
        name: "Custom Chain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"],
            },
        },
    });
    return currentChain;
}

async function getBalance(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        
        const balance: bigint = await publicClient.getBalance({
            address: contractAddress as Address,
        });
        
        console.log(formatEther(balance));
        alert(`Balance: ${formatEther(balance)} ETH`);
    }
}

async function withdraw(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        try {
            walletClient = createWalletClient({
                transport: custom(window.ethereum),
            });
            
            publicClient = createPublicClient({
                transport: custom(window.ethereum),
            });
            
            const [account]: Address[] = await walletClient.requestAddresses();
            const currentChain: Chain = await getCurrentChain(walletClient);

            console.log("Processing transaction...");
            
            const { request } = await publicClient.simulateContract({
                account,
                address: contractAddress as Address,
                abi,
                functionName: "withdraw",
                chain: currentChain,
                value: parseEther("0"),
            });
            
            const hash: Hash = await walletClient.writeContract(request);
            console.log("Withdrawal transaction hash:", hash);
        } catch (error) {
            console.error("Error processing transaction:", error);
            alert("Transaction failed.");
        }
    } else {
        withdrawButton.innerHTML = "pls install metamask!";
    }
}

async function getAddressToAmountFunded(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });
        
        const [getAddressToAmountFunded]: any = await walletClient?.getAddresses();
        
        console.log("Address to Amount Funded:", getAddressToAmountFunded);
     }
}
// Event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
getAddressToAmountFundedButton.onclick = getAddressToAmountFunded;