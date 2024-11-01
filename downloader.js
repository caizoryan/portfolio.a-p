
let force = "&force=true";
let host = "http://localhost:3000/api/";
// let host = "https://api.are.na/v2/";

let projects_fetch = await fetch(
	host + "channels/projects-hlemx_lvnvw?per=100" + force,
)
	.then((res) => res.json())
	.then((res) => res.contents);

console.log(projects_fetch.title);
let projects = [];

for (let i = 0; i < projects_fetch.length; i++) {
	await get_channel(projects_fetch[i].id).then((res) => {
		console.log(res.title);
		projects.push(res);
	});
}

const data = { projects };

//
await Bun.write(
	"data.js",
	"export const data = " + JSON.stringify(data, null, 2) + ";",
);
//

// -------------------------
// UTILS
async function get_channel(id) {
	let project = await fetch(host + "channels/" + id + "?per=100" + force).then((res) => res.json());
	return project;
}
