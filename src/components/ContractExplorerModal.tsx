import { Button, Modal, Icon, IconButton } from "@stellar/design-system"
import * as React from "react"
import {
	ContractExplorer,
	type ContractExplorerProps,
} from "./ContractExplorer"
import "../styles.css"

export type ContractExplorerModalProps = {
	/**
	 * Set this to true if you want the dev tools open by default
	 */
	initialIsOpen?: boolean
	/**
	 * Placement for the toggle button, default "right"
	 */
	placement?: "left" | "right"
} & ContractExplorerProps

export function ContractExplorerModal({
	initialIsOpen = false,
	placement = "right",
	...rest
}: ContractExplorerModalProps): React.ReactElement | null {
	const [isOpen, setIsOpen] = React.useState(initialIsOpen)
	const toggleIsOpen = React.useCallback(
		() => setIsOpen((prev) => !prev),
		[setIsOpen],
	)

	// HACK: @stellar/design-system Modal doesn't allow custom classes so
	// this will help us scope our styles to _our_ modal and not _all_
	// modals in the app. Since it makes use of Portals, we can't use a
	// class name on a parent element.
	React.useEffect(() => {
		if (isOpen) {
			document.body.classList.add("ContractExplorer--open")
		} else {
			document.body.classList.remove("ContractExplorer--open")
		}
	}, [isOpen])

	const title = `${isOpen ? "Close" : "Open"} Contract Explorer`
	const icon = isOpen ? <Icon.X /> : "🔍"

	return (
		<>
			<Button
				className={`ContractExplorer__toggle ContractExplorer__toggle--${placement} Button Button--primary Button--xl`}
				variant="primary"
				size="xl"
				onClick={toggleIsOpen}
				title={title}
			>
				<span>{title}</span>
				{icon}
			</Button>

			<Modal visible={isOpen} onClose={toggleIsOpen}>
				<Modal.Heading>📃🔍 Contract Explorer</Modal.Heading>

				<Modal.Body>
					<IconButton
						altText={title}
						icon={icon}
						onClick={toggleIsOpen}
						className="ContractExplorer__toggle-icon Button Button--xl Button--primary"
					/>

					<ContractExplorer {...rest} />
				</Modal.Body>
			</Modal>
		</>
	)
}
