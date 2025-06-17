"use client";

import React, { useState } from "react";
import FileDropZone from "./components/FileDropZone";
import List from "./components/List";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [storeToDB, setStoreToDB] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([]);

  const handleStoreToDBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreToDB(e.target.checked);
    setDescriptions(Array(files.length).fill(""));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDesc = [...descriptions];
    newDesc[index] = value;
    setDescriptions(newDesc);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newDesc = [...descriptions];
    newDesc.splice(index, 1);
    setDescriptions(newDesc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select or drop at least one file.");
      return;
    }
    if (storeToDB && descriptions.some((d) => !d.trim())) {
      alert("Please fill all descriptions.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("storeToDB", storeToDB ? "true" : "false");
    files.forEach((file) => formData.append("files", file));
    if (storeToDB) {
      descriptions.forEach((desc) => formData.append("descriptions", desc));
    }

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      data.data.forEach((msg: string) => alert(msg));
      setFiles([]);
      setTitle("");
      setContent("");
      setStoreToDB(false);
      setDescriptions([]);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Upload to Discord</h2>

      <FileDropZone
        files={files}
        setFiles={(newFiles) => {
          setFiles(newFiles);
          setDescriptions(Array(newFiles.length).fill(""));
        }}
      />

      <div className="mt-4 space-y-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-md shadow-sm"
          >
            <p className="font-medium">{file.name}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
              {storeToDB && (
                <input
                  type="text"
                  placeholder="Description"
                  value={descriptions[index] || ""}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                />
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-red-600 hover:text-red-800 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Content"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={storeToDB}
            onChange={handleStoreToDBChange}
          />
          Store file URLs & descriptions to TursoDB
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send to Discord
        </button>
      </form>
      <List />
    </main>
  );
}
