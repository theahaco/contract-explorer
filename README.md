<div align="center" style="font-size: 2em;">✨📃🔍</div>

# Stellar Contract Explorer

Explore, test, and debug Stellar smart contracts directly from your dApp. Made to work with [Scaffold Stellar](https://scaffoldstellar.com), but configurable enough to handle any React application.

- 👀 Explore available contracts in full UI
- 🔥 View hot-reloading contract documentation in development
- 🔗 Fetch deployed contract metadata directly from the network
- ⚡️ Run or simulate transactions with validated input
- 📊 Get transaction results immediately in JSON


## Setup

```sh
npm install stellar-contract-explorer
```

Open your `App.tsx` file and import the `<ContractExplorer>` component along with the `loadContracts` utility. This will handle parsing the RPC clients created by the Scaffold Stellar

```js
import { ContractExplorer, loadContracts } from "stellar-contract-explorer";
// Import network information containing passphrase, RPC URL, etc.
import { network } from "./contracts/util";
import { useWallet } from "./hooks/useWallet";

// Import your contract modules using your preferred bundler
const contractModules = import.meta.glob("./contracts/*.ts");
// Then pass them all to our custom loader
const contracts = await loadContracts(contractModules);

function App() {
  // Connect to wallet for user's address and signTransaction function
  const wallet = useWallet();

  return (
    <>
      {/* Your app components */}

      <ContractExplorer contracts={contracts} network={network} {...wallet} />
    </>
  )
}
```

## Options

- `placement: "left" | "right"`: placement of the modal toggle button (default `"right"`)
- `initialIsOpen: boolean`: initial view state of the modal on load (default `false`)


## Production Builds

By default, the explorer is excluded in production builds so you don't have to worry about shipping it within your application.


---

<div align="center">
  <p>Brought to you by your friends at</p>
  <a
    alt="The Aha Co"
    href="https://theaha.co"
  >
    <img
      width="300px"
      src="logo.svg"
    />
  </a>
</div>
