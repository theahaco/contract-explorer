import { createContext, use } from "react"
import { type Network, type SignTransactionFn } from "./types/types"

interface ContractExplorerContext {
	/** User's wallet address if connected */
	address?: string
	signTransaction?: SignTransactionFn
	/** Network info */
	network: Network
	/** Prefix URL for Stellar Lab  */
	labUrl: string
}

const stellarEncode = (str: string) => {
	return str.replace(/\//g, "//").replace(/;/g, "/;")
}

export const getLabUrl = (network: Network) => {
	const domain =
		network.id === "local"
			? "http://localhost:8000/lab"
			: "https://lab.stellar.org"

	const params = new URLSearchParams([
		["id", network.id],
		["label", network.label],
		["horizonUrl", stellarEncode(network.horizonUrl)],
		["rpcUrl", stellarEncode(network.rpcUrl)],
		["networkPassphrase", stellarEncode(network.passphrase)],
	])

	return `${domain}/transaction-dashboard?$=network$${params}`
}

const defaultNetwork: Network = {
	id: "local",
	label: "Local",
	passphrase: "Standalone Network ; February 2017",
	rpcUrl: "http://localhost:8000/rpc",
	horizonUrl: "http://localhost:8000",
}

export const CEContext = createContext<ContractExplorerContext>({
	address: undefined,
	signTransaction: async (xdr: string) => ({ signedTxXdr: xdr }),
	network: defaultNetwork,
	labUrl: getLabUrl(defaultNetwork),
})

export const useContext = () => {
	const ctx = use(CEContext)
	if (!ctx) {
		throw new Error("ContractExplorerContext is not available")
	}
	return ctx
}
