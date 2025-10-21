import * as components from "./ContractExplorer"
export { loadContracts } from "./util/loadContracts"

// Prevent contract explorer from being used in production
export const ContractExplorer: (typeof components)["ContractExplorer"] =
	process.env.NODE_ENV === "development"
		? components.ContractExplorer
		: function () {
				return null
			}
