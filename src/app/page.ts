import { env } from "mini-van-plate/shared"
import Counter from "../components/counter"

const { div, h1, span } = env.van.tags

export const title = "Home hello"

export default async function HomePage() {
	const randomNumber = Math.floor(Math.random() * 10) + 1
	const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${randomNumber}`)
	const data = await res.json()
	return div(h1("Home Page"), span(data.title), Counter({ initialState: randomNumber }))
}
