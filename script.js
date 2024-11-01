import { mem, render, html, sig } from "./solid_monke/solid_monke.js"
import { data } from "./data.js"

let projects = data.projects

let all_images = data.projects.reduce((acc, project) => {
	let filtered = project.contents.filter((c) => c.class == "Image")
	filtered = filtered.map((c) => ({ ...c, parent_slug: project.slug }))
	return acc.concat(filtered)
}, [])
let shuffle = (arr) => arr.sort(() => Math.random() - 0.5)
all_images = shuffle(all_images)

let hovered_slug = sig("")

function SideBar() {
	let title = "Aaryan Pashine is a designer and coder based in Toronto, Canada."
	let links = {
		"Are.na": "https://are.na/aaryan-pashine",
		"Github": "https://github.com/caizoryan",
		"Email": "mailto:pashineaaryan@gmail.com"
	}

	let current = "Currently pursuing a BFA in Graphic Design at OCAD U"

	return html`
			h4 -- ${title}
			p -- ${current}
			p -- ${Object.entries(links).map(([key, value]) => html` a [href=${value}] -- ${key} `)} 
			.project-list
				ol
					each of ${projects} as ${project_title}
			`
}

function project_title(p) {
	let selected = mem(() => hovered_slug() === p.slug)
	let style = () => selected() ? "font-weight: bold" : ""
	let onmouseenter = () => hovered_slug.set(p.slug)
	return html`li [style=${style} onmouseenter=${onmouseenter}] -- ${p.title}`
}

function Display() {
	return html`
		each of ${all_images} as ${ImageThumb}
`
}

function ImageThumb(img) {
	let selected = mem(() => hovered_slug() === img.parent_slug)
	let style = () => selected() ? "filter: none" : " filter: grayscale(100%); "
	let onmouseenter = () => hovered_slug.set(img.parent_slug)


	return html`img [onmouseenter=${onmouseenter} style=${style} src=${img.image.thumb.url}]`

}

function Mother() {
	return html`
		.mother
			.sidebar -- ${SideBar}
			.display -- ${Display}
	`
}

// able to toggle display mode, where you can choose image sizing.. either display res, orgingial , thumb or medium
// 
// displaying image will have
// file size
// image title
// and the image

render(Mother, document.body)
