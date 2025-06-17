import { useState } from 'react';

export type Row = [id: string | number, name: string, url: string, description: string];

export default function FileList() {
	const [rows, setRows] = useState<Row[]>([]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);

	const fetchList = async () => {
		setLoading(true);
		try {
			const res = await fetch('/list');
			const data = await res.json();
			setRows(data.rows);
		} catch (err) {
			console.error('Failed to fetch list', err);
		} finally {
			setLoading(false);
		}
	};

	const handleButtonClick = () => {
		if (!visible) {
			setVisible(true);
			fetchList();
		} else {
			fetchList();
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-8">
			<h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>

			<button onClick={handleButtonClick} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-6">
				{visible ? 'Refresh List' : 'Show List'}
			</button>

			{visible && (
				<>
					{loading ? (
						<p>Loading...</p>
					) : rows.length === 0 ? (
						<p className="text-gray-600">No files found.</p>
					) : (
						<div className="space-y-6">
							{rows.map(([id, name, url, description]) => (
								<div key={id} className="border p-4 rounded shadow hover:shadow-md transition">
									<h3 className="text-lg font-semibold">{name}</h3>
									<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
										{url}
									</a>
									<p className="text-gray-700 mt-2">Description: {description}</p>
								</div>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
