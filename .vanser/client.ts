import { registerEnv } from "mini-van-plate/shared"
import van from "vanjs-core"
import * as Components from "./client-imports"

registerEnv({ van })

const hydrate = () => {
	document.querySelectorAll("[vanser]").forEach((dom) => {
		const componentName = dom.getAttribute("componentname")
		if (!componentName) throw new Error("Could not hydrate: componentName attribute is missing")
		const hydrationData = JSON.parse(dom.getAttribute("hydrationdata") || "{}")
		console.log(dom.getAttribute("hydrationdata"))
		if (Object.values(hydrationData).length > 1) {
			throw new Error("Could not hydrate: multiple function parameters are not supported")
		}
		//@ts-ignore
		const fn = Components[componentName]
		if (fn) {
			van.hydrate(dom, () => {
				return fn(hydrationData[0])
			})
		}
	})
	document.querySelectorAll("[vanser]").forEach((dom) => {
		dom.removeAttribute("vanser")
		dom.removeAttribute("componentname")
		dom.removeAttribute("hydrationdata")
	})
}
document.addEventListener("DOMContentLoaded", () => {
	hydrate()
})
