import { mem, render, html, sig } from "./solid_monke/solid_monke.js"
import { data } from "./data.js"
import { MD } from "./md.js"

let projects = data.projects
projects = projects.map((p) => ({ ...p, title: p.title.replace("✱", "") }))
projects = projects.map((p) => ({ ...p, contents: p.contents.sort((a, b) => b.position - a.position) }))

let all_images = data.projects.reduce((acc, project) => {
	let filtered = project.contents.filter((c) => c.class == "Image")
	filtered = filtered.map((c) => ({ ...c, parent_slug: project.slug }))
	return acc.concat(filtered)
}, [])
let shuffle = (arr) => arr.sort(() => Math.random() - 0.5)
all_images = shuffle(all_images)

let hovered_slug = sig("")
let selected_slug = sig("")

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
	let onclick = () => selected_slug.set(p.slug)
	return html`li.pointer [style=${style} onclick=${onclick} onmouseenter=${onmouseenter}] -- ${p.title}`
}

function Display() {
	let none_selected = mem(() => selected_slug() === "")
	let selected_project = mem(() => projects.find((p) => p.slug === selected_slug()))

	let displayer = mem(() => {
		if (none_selected()) return html`each of ${all_images} as ${ImageThumb}`
		else return html`each of ${selected_project().contents} as ${DisplayBlocks}`
	})

	return html`div -- ${displayer}`
}

function DisplayBlocks(block) {
	if (block.class === "Image") return ImageDisplay(block)
	if (block.class === "Text") return TextDisplay(block)
	if (block.class === "Attachment") return AttachmentDisplay(block)
}

function AttachmentDisplay(att) {
	if (att.attachment.extension === "mp4") {
		return html`video.display [src=${att.attachment.url} autoplay=true loop=true]`
	}
}

function TextDisplay(text) {
	if (text.class !== "Text") return html``
	return html`.text.display -- ${MD(text.content)}`
}

function ImageDisplay(img) {
	if (img.class !== "Image") return html``

	return html`img.display [src=${img.image.display.url}]`
}

function ImageThumb(img) {
	let selected = mem(() => hovered_slug() === img.parent_slug)

	let onclick = () => selected_slug.set(img.parent_slug)
	let style = () => selected() ? "filter: none" : " filter: grayscale(100%); "
	let onmouseenter = () => hovered_slug.set(img.parent_slug)

	return html`img.thumb [onclick=${onclick} onmouseenter=${onmouseenter} style=${style} src=${img.image.thumb.url}]`

}

function Mother() {
	return html`
		.mother
			.sidebar -- ${SideBar}
			.display-container -- ${Display}
	`
}

// able to toggle display mode, where you can choose image sizing.. either display res, orgingial , thumb or medium
// 
// displaying image will have
// file size
// image title
// and the image

render(Mother, document.body)
