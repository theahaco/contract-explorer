/**
 * Minimal counter contract fixture representing what Scaffold Stellar generates
 * for a simple contract. Built from XDR spec entries — no network required.
 *
 * Functions:
 *   increment(by: u32) -> u32
 *   get_count()        -> u32
 */
import { xdr } from "@stellar/stellar-sdk"
import { Client, Spec } from "@stellar/stellar-sdk/contract"

const entries = [
	xdr.ScSpecEntry.scSpecEntryFunctionV0(
		new xdr.ScSpecFunctionV0({
			doc: "Increment the counter by the given amount",
			name: "increment",
			inputs: [
				new xdr.ScSpecFunctionInputV0({
					doc: "Amount to increment by",
					name: "by",
					type: xdr.ScSpecTypeDef.scSpecTypeU32(),
				}),
			],
			outputs: [xdr.ScSpecTypeDef.scSpecTypeU32()],
		}),
	),
	xdr.ScSpecEntry.scSpecEntryFunctionV0(
		new xdr.ScSpecFunctionV0({
			doc: "Return the current counter value",
			name: "get_count",
			inputs: [],
			outputs: [xdr.ScSpecTypeDef.scSpecTypeU32()],
		}),
	),
]

const counterClient = new Client(new Spec(entries), {
	contractId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
	networkPassphrase: "Standalone Network ; February 2017",
	rpcUrl: "http://localhost:8000/rpc",
	allowHttp: true,
})

export default counterClient
