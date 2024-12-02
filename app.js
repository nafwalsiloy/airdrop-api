let provider;
let signer;
let userAddress;
let eligibility = false;
let value;
let valuewei;
let proof;

const connectButton = document.getElementById('connectButton');
const checkEligibilityButton = document.getElementById('checkEligibilityButton');
const claimButton = document.getElementById('claimButton');
const status = document.getElementById('status');

// Custom RPC URL for a specific chain (e.g., Polygon)
const CUSTOM_RPC_URL = "https://421614.rpc.thirdweb.com";  // Change this URL to the RPC URL of your desired chain
const TARGET_CHAIN_ID = 421614;  // Polygon Mainnet Chain ID (Change based on your desired chain)

// Connect to Ethereum Wallet (MetaMask version 12.x.x and later)
connectButton.addEventListener('click', async () => {
	if (window.ethereum) {
		try {
			// Request account access (MetaMask 12.x.x and above)
			console.log('Attempting to connect to MetaMask...');
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			if (accounts && accounts.length > 0) {
				userAddress = accounts[0];

				// Set up provider and signer using the correct constructor
				provider = new ethers.providers.Web3Provider(window.ethereum);
				signer = provider.getSigner();
				status.textContent = `Wallet connected: ${userAddress}`;

				// Hide the "Connect Wallet" button and show the "Check Eligibility" button
				connectButton.style.display = "none";
				checkEligibilityButton.style.display = "inline-block";
				checkEligibilityButton.disabled = false;  // Enable the "Check Eligibility" button

				// Listen for account changes
				window.ethereum.on('accountsChanged', (accounts) => {
					userAddress = accounts[0];
					status.textContent = `Wallet changed: ${userAddress}`;
				});

				// Listen for network changes
				window.ethereum.on('chainChanged', () => {
					window.location.reload();
				});

				// Switch to the target chain (custom RPC URL and chain ID)
				await switchNetwork();
			} else {
				status.textContent = "No accounts found. Please ensure MetaMask is unlocked.";
			}
		} catch (error) {
			console.error("Error during wallet connection:", error);

			if (error.code === 4001) {
				status.textContent = "Connection request denied. Please try again.";
			} else if (error.message.includes("User Rejected")) {
				status.textContent = "Connection request was rejected by the user.";
			} else {
				status.textContent = "Error connecting to wallet.";
			}
		}
	} else {
		status.textContent = "Please install MetaMask or another Ethereum wallet.";
	}
});

// Function to switch to a specific network using custom RPC URL
async function switchNetwork() {
	try {
		const chainId = `0x${TARGET_CHAIN_ID.toString(16)}`;  // Convert to hex format
		// Check if the user is already on the target network
		const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
		if (currentChainId !== chainId) {
			// Switch to the target network (Polygon in this case)
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainId }]
			});
		}
	} catch (error) {
		if (error.code === 4902) {
			// Chain not added, add it
			await window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [{
					chainId: `0x${TARGET_CHAIN_ID.toString(16)}`, // Convert Chain ID to hex
					chainName: "Arbitrum Sepolia",
					rpcUrls: [CUSTOM_RPC_URL],  // Custom RPC URL
					nativeCurrency: {
						name: "ETH",
						symbol: "ETH",
						decimals: 18
					},
					blockExplorerUrls: ["https://sepolia.arbiscan.io"]
				}]
			});
		} else {
			console.error("Error switching network:", error);
		}
	}
}

// Check eligibility via API
checkEligibilityButton.addEventListener('click', async () => {
	status.textContent = "Checking eligibility...";
	try {
		// Replace this with your real API endpoint
		const response = await fetch(`https://airdrop.airdropfamilyidn.com/api/eligibility?address=${userAddress}`);
		const data = await response.json();
		if (data.eligible) {
			eligibility = true;
			value = data.value;  // The eligible value to claim
			//valuewei = value * (10**18);
			// Convert value to wei safely using BigNumber
			valuewei = ethers.BigNumber.from(value.toString()).mul(ethers.BigNumber.from(10).pow(18));
			proof = data.proof;  // Proof (if needed)

			// Hide the "Check Eligibility" button and show the "Claim Airdrop" button
			checkEligibilityButton.style.display = "none";
			claimButton.style.display = "inline-block";
			claimButton.disabled = false;  // Enable the "Claim Airdrop" button

			status.textContent = `You are eligible for an airdrop of ${value} tokens!`;
		} else {
			eligibility = false;
			status.textContent = "You are not eligible for the airdrop.";
		}
	} catch (error) {
		status.textContent = "Error checking eligibility.";
		console.error(error);
	}
});

// Claim the airdrop
claimButton.addEventListener('click', async () => {
	if (!eligibility) {
		status.textContent = "You are not eligible for the airdrop.";
		return;
	}

	status.textContent = "Claiming airdrop...";
	try {
		// Replace this with your real contract address and ABI
		const contractAddress = "0xbe74e347b267dcead603767c549fb490c33baab7";
		const contractABI = [
			"function claim(address user, uint256 amount, bytes32[] calldata proof) external"
		];

		const contract = new ethers.Contract(contractAddress, contractABI, signer);
		const tx = await contract.claim(userAddress, valuewei, proof);
		await tx.wait();

		status.textContent = "Airdrop claimed successfully!";
	} catch (error) {
		status.textContent = "Error claiming airdrop.";
		console.error(error);
	}
});
