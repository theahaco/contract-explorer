import { ContractExplorer as _CE } from "./components/ContractExplorer"
import { ContractExplorerModal as _CEM } from "./components/ContractExplorerModal"
export { loadContracts } from "./util/loadContracts"

// Prevent contract explorer from being used in production
export const ContractExplorer =
	process.env.NODE_ENV === "development"
		? _CE
		: function () {
				return null
			}

export const ContractExplorerModal =
	process.env.NODE_ENV === "development"
		? _CEM
		: function () {
				return null
			}
