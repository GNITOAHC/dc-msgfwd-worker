console.log('✅ index.js is loaded and running!');

export function myFunction() {
	alert('Hello from myFunction!');
	document.getElementById('buttonq').innerText = 'Button clicked';
}
window.myFunction = myFunction;

export async function list() {
	const result = await fetch('/list', {
		method: 'GET',
	});
	// console.log(await result.json());
	const res = await result.json();

	const container = document.getElementById('list');

	res.rows.forEach((row) => {
		const [id, name, url, description] = row;

		const item = document.createElement('div');
		item.className = 'file-item';

		// filename
		const nameEl = document.createElement('h3');
		nameEl.textContent = name;

		// URL (as link)
		const linkEl = document.createElement('a');
		linkEl.href = url;
		linkEl.textContent = url;
		linkEl.target = '_blank';

		// description
		const descEl = document.createElement('p');
		descEl.textContent = `Description: ${description}`;

		item.appendChild(nameEl);
		item.appendChild(linkEl);
		item.appendChild(descEl);

		container.appendChild(item);
	});
}
window.list = list;
