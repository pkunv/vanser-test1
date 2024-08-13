import { env } from "mini-van-plate/shared"
import { VanserComponent } from "../lib/vanser-component"

export default function Counter({ initialState }: { initialState?: number }) {
	const { div, button, span } = env.van.tags
	const counter = env.van.state(initialState || 0)
	return div(
		VanserComponent(Counter.name, arguments),
		span("Counter: ", counter),
		button({ onclick: () => ++counter.val }, "Increment")
	)
}
