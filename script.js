import { render, html } from "./solid_monke/solid_monke.js"
import { data } from "./data.js"

let projects = data.projects
let all_images = data.projects.reduce((acc, project) => {
	return acc.concat(project.contents.filter((c) => c.class == "Image"))
}, [])

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
				each of ${projects} as ${project_title}
			`
}

function project_title(p) {
	return html`p -- ${p.title}`
}

function Display() {
	return html`
		each of ${all_images} as ${ImageThumb}
`
}

function ImageThumb(img) {

	return html`img [src=${img.image.thumb.url}]`

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
