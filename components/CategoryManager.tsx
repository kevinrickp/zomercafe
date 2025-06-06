"use client";

import { useEffect, useState } from "react";

export default function CategoryManager() {
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    const res = await fetch("http://localhost:4000/categories");
    const json = await res.json();
    setCats(json.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    await fetch(
      editId
        ? `http://localhost:4000/categories/${editId}`
        : "http://localhost:4000/categories",
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );
    setName("");
    setEditId(null);
    load();
  };

  const remove = async (id: number) => {
    await fetch(`http://localhost:4000/categories/${id}`, { method: "DELETE" });
    if (editId === id) {
      setEditId(null);
      setName("");
    }
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kategori"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          {editId ? "Update" : "Tambah"}
        </button>
        {editId && (
          <button
            type="button"
            className="bg-gray-300 px-4 rounded"
            onClick={() => {
              setEditId(null);
              setName("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul className="space-y-2">
        {cats.map((c) => (
          <li key={c.id} className="flex justify-between">
            <span>{c.name}</span>
            <div className="space-x-2">
              <button
                className="text-blue-600"
                onClick={() => {
                  setEditId(c.id);
                  setName(c.name);
                }}
              >
                Edit
              </button>
              <button className="text-red-600" onClick={() => remove(c.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
