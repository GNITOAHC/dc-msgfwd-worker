"use client";
import { useState } from "react";
import Link from "next/link";

export type Row = [
  id: string | number,
  name: string,
  url: string,
  description: string,
];

export default function FileList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const _fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      console.log(data);
      console.log(data.rows);
      setRows(data.rows);
    } catch (err) {
      console.error("Failed to fetch list", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = () => {
    if (!visible) {
      setVisible(true);
      _fetchList();
    } else {
      _fetchList();
    }
  };

  const deleteFile = async (id: string | number) => {
    try {
      const res = await fetch("/api/files/" + id, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete file");
        return;
      }
      const newRows = rows.filter((row) => row[0] !== id);
      setRows(newRows);
    } catch (err) {
      console.log("Failed to delete file", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>

      <button
        onClick={() => fetchFiles()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-6"
      >
        {visible ? "Refresh List" : "Show List"}
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
                <div
                  key={id}
                  className="border p-4 rounded shadow hover:shadow-md transition flex flex-row"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-blue-500"
                      >
                        {name}
                      </Link>
                    </h3>
                    <div className="text-gray-700 mt-2 whitespace-pre-line">
                      {description}
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col justify-center">
                    <button
                      onClick={() => deleteFile(id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
