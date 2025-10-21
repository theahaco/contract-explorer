import { Client } from "@stellar/stellar-sdk/contract"

type ContractModule = {
	default: Client
}

export type ContractMap = Record<string, ContractModule>

export type Contracts = {
	loaded: ContractMap
	failed: Record<string, string>
	contractNames: string[]
}

/**
 * Type guard to narrow result to a function
 */
const isFn = (fn: unknown): fn is (() => unknown) | (() => Promise<unknown>) =>
	fn instanceof Function

/**
 * Type guard to narrow result to contract module
 */
const isContractModule = (module: unknown): module is ContractModule => {
	return (
		typeof module === "object" &&
		module !== null &&
		"default" in module &&
		module.default instanceof Client
	)
}

/**
 * In case function is synchronous, wrap result in a Promise so it can be awaited
 */
async function safeAwait<T>(fn: (() => T) | (() => Promise<T>)): Promise<T> {
	const result = fn()
	return result instanceof Promise ? result : Promise.resolve(result)
}

/**
 * Load contracts from files
 *
 * @example
 * ```typescript
 * const modules = import.meta.glob("../contracts/*.ts", { eager: true })
 * const contracts = await loadContracts(modules)
 *
 * <ContractExplorer contracts={contracts} />
 * ```
 */
export const loadContracts = async (
	contractModules: Record<string, unknown>,
): Promise<Contracts> => {
	const loaded: ContractMap = {}
	const failed: Record<string, string> = {}

	for (const [path, importFn] of Object.entries(contractModules)) {
		debugger
		const filename = path.split("/").pop()?.replace(".ts", "") || ""

		// TODO: remove util.ts from contract module directory for ease of loading
		if (filename && filename === "util") continue

		try {
			if (!isFn(importFn)) throw new Error("Invalid import function")

			const module = await safeAwait(importFn)

			if (!isContractModule(module)) throw new Error("Invalid contract module")

			loaded[filename] = module
		} catch (error) {
			failed[filename] = error instanceof Error ? error.message : String(error)
		}
	}

	const contractNames = Array.from(
		new Set([...Object.keys(loaded), ...Object.keys(failed)]),
	)

	return { loaded, failed, contractNames }
}
