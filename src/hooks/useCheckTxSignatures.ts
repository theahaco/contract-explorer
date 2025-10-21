import { useQuery } from "@tanstack/react-query"
import { useContext } from "../context"
import { fetchTxSignatures } from "../util/fetchTxSignatures"
import { getNetworkHeaders } from "../util/getNetworkHeaders"

export const useCheckTxSignatures = ({ xdr }: { xdr: string }) => {
	const { network } = useContext()

	const query = useQuery({
		queryKey: ["tx", "signatures"],
		queryFn: async () => {
			try {
				return await fetchTxSignatures({
					txXdr: xdr,
					networkPassphrase: network.passphrase,
					networkUrl: network.horizonUrl,
					headers: getNetworkHeaders(network, "horizon"),
				})
			} catch (e) {
				throw new Error(
					`There was a problem checking transaction signatures: ${e as Error}`,
				)
			}
		},
		enabled: false,
	})

	return query
}
