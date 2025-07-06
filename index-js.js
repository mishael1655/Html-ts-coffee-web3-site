import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem@2.31.6"
import { contractAddress,abi }from "./constant-js.js"


const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
const getAddressToAmountFundedButton = document.getElementById("getAddressToAmountFunded");

let walletClient
let publicClient
async function connect() {
    if (typeof window.ethereum !== undefined) {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses()
        connectButton.innerHTML = "connected!"

    } else{
        connectButton.innerHTML("pls install metamask!")
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log("Funding with amount:", ethAmount);
    if (typeof window.ethereum !== undefined) {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const { request} = await publicClient.simulateContract({
            address: contractAddress, // Replace with your contract address
            abi: abi, // Replace with your contract ABI
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount), // Convert to wei

        })

        const hash = await walletClient.writeContract(request)
        console.log("Transaction processed:", hash)
        alert(`Transaction sent! Hash: ${hash}`)
    } else{
        fundButton.innerHTML("pls install metamask!")
    }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
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
  })
  return currentChain
}

async function getBalance() {
    if (typeof window.ethereum !== undefined) {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const balance = await publicClient.getBalance({
          address: contractAddress,// Replace with your contract address
          
    })
        console.log(formatEther(balance));// Convert balance from wei to ether
        alert(`Balance: ${formatEther(balance)} ETH`);
    }
}

async function withdraw() {
    if (typeof window.ethereum !== undefined) {
        try {
            walletClient = createWalletClient({
                transport: custom(window.ethereum),
        })
        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        })
        const [account] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)


        console.log("Processing transaction...")
      const { request } = await publicClient.simulateContract({
        account,
        address: contractAddress,
        abi,
        functionName: "withdraw",
        chain: currentChain,
        value: parseEther("0"), // No value needed for withdraw
      })
      const hash = await walletClient.writeContract(request)
      console.log("Withdrawal transaction hash:", hash)
    } catch (error) {
        console.error("Error processing transaction:", error)
        alert("Transaction failed.")
    }
  } else {
        withdrawButton.innerHTML("pls install metamask!")
    }
}

async function getAddressToAmountFunded() {
    if (typeof window.ethereum !== undefined) {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const getAddressToAmountFunded = await walleClient.getAddresses({
          address: contractAddress,// Replace with your contract address
          
    })
        console.log("Address to Amount Funded:", getAddressToAmountFunded);
    }
}


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
getAddressToAmountFundedButton.onclick 
