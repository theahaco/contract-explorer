import {
	Alert,
	Badge,
	Card,
	Input,
	Label,
	Link,
	Table,
	Text,
} from "@stellar/design-system"
import React from "react"
import { useContext } from "../context"
import {
	loadContractMetadata,
	type ContractMetadata,
} from "../util/loadContractMetada"
import { Box } from "./Box"

interface RenderContractMetadataProps {
	contractId: string
}

const metaDocsLink =
	"https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-meta"

enum ContractMetadataType {
	SCEnvMetaEntry = "SCEnvMetaEntry",
	SCMetaEntry = "SCMetaEntry",
}

interface TableItem {
	metaType: ContractMetadataType
	val: string
	key: string
	id: string
}
const RenderContractMetadata: React.FC<RenderContractMetadataProps> = ({
	contractId,
}) => {
	const { network } = useContext()
	const [metadata, setMetadata] = React.useState<
		ContractMetadata | null | "error"
	>(null)

	React.useEffect(() => {
		setMetadata(null)
		loadContractMetadata(contractId, network.rpcUrl)
			.then((res) => {
				setMetadata(res)
			})
			.catch(() => {
				setMetadata("error")
			})
	}, [contractId, network.rpcUrl, setMetadata])

	if (!metadata) return null

	if (metadata === "error") {
		return (
			<Alert
				variant="warning"
				placement="inline"
				title="Error loading metadata"
			>
				Could not load metadata for contract <code>{contractId}</code> at the
				following RPC URL:
				<br />
				<code>{network.rpcUrl}</code>
			</Alert>
		)
	}

	const formatTableItems = (
		data: unknown,
		metaType: ContractMetadataType,
	): TableItem[] => {
		if (typeof data !== "object" || data === null) {
			return []
		}
		return Object.entries(data).map(([key, value]) => ({
			key: String(key),
			val: value as string,
			id: String(key),
			metaType: metaType,
		}))
	}

	const getTableData = (): TableItem[] => {
		const tableEntries: TableItem[] = [
			...formatTableItems(
				metadata.contractmetav0,
				ContractMetadataType.SCMetaEntry,
			),
			...formatTableItems(
				metadata.contractenvmetav0,
				ContractMetadataType.SCEnvMetaEntry,
			),
		]
		return tableEntries
	}

	const renderTextCell = (item: string) => (
		<td
			style={{
				paddingLeft: "1rem",
				paddingRight: "1rem",
				paddingTop: "0.5rem",
				paddingBottom: "0.5rem",
			}}
		>
			<Text as="p" size="xs">
				{item}
			</Text>
		</td>
	)

	const renderBadgeCell = (item: string) => (
		<td
			style={{
				paddingLeft: "1rem",
				paddingRight: "1rem",
				paddingTop: "0.5rem",
				paddingBottom: "0.5rem",
			}}
		>
			<Badge size="sm" variant="secondary">
				{item}
			</Badge>
		</td>
	)

	const renderRow = (key: string, val: string, type: ContractMetadataType) => (
		<>
			{renderBadgeCell(type)}
			{renderTextCell(key)}
			{renderTextCell(val)}
		</>
	)

	return (
		<>
			<Input
				label="Contract Wasm Hash"
				id="contract-wasm-hash"
				fieldSize="md"
				copyButton={{
					position: "right",
				}}
				readOnly
				value={metadata?.wasmHash}
			/>

			<Box gap="sm" direction="column">
				<Label size="sm" htmlFor="contract-metadata">
					Contract Metadata
				</Label>
				<Card variant="primary">
					<Text as="span" size="xs">
						This section contains the metadata of the contract, which is a
						collection of key-value pairs that provide additional information
						about the contract. This data is added to the contract during
						compilation and can be retrieved directly from the WASM file. See{" "}
						<Link href={metaDocsLink} target="_blank" rel="noopener noreferrer">
							Contract Metadata Documentation
						</Link>{" "}
						for further details.
					</Text>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							marginTop: "1.5rem",
						}}
					>
						<Table
							breakpoint={300}
							hideNumberColumn
							columnLabels={[
								{ id: "type", label: "Type" },
								{ id: "key", label: "Key" },
								{ id: "value", label: "Value" },
							]}
							data={getTableData()}
							renderItemRow={(item: TableItem) =>
								renderRow(item.key, item.val, item.metaType)
							}
						/>
					</div>
				</Card>
			</Box>
		</>
	)
}

export default RenderContractMetadata
