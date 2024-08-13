import { env } from "mini-van-plate/shared"

const { div, h1 } = env.van.tags

export const title = "Home hello"

export default function subPage() {
	return div(h1("Sub page here"))
}
