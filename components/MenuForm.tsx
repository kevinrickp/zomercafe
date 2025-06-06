"use client";

import { useEffect, useState } from "react";

type Props = {
  defaultValues?: any;
  onSubmit: (data: FormData, isEdit: boolean, id?: number) => Promise<void>;
};

export default function MenuForm({ defaultValues = {}, onSubmit }: Props) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [form, setForm] = useState({
    name: defaultValues.name || "",
    description: defaultValues.description || "",
    price: defaultValues.price ? defaultValues.price.toString() : "",
    categoryId: defaultValues.categoryId || "",
    image: null as File | null,
  });

  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then((r) => r.json())
      .then((j) => setCategories(j.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    if (form.image) fd.append("image", form.image);
    fd.append("categoryId", form.categoryId);
    await onSubmit(fd, !!defaultValues.id, defaultValues.id);
  };

  return (
    <form onSubmit={submit} className="p-4 border rounded space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nama Menu"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Deskripsi"
        required
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        type="number"
        placeholder="Harga"
        required
      />
      <input
        type="file"
        accept="image/*"
        name="image"
        onChange={handleChange}
      />
      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        required
      >
        <option value="">Pilih Kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {defaultValues.id ? "Update Menu" : "Tambah Menu"}
      </button>
    </form>
  );
}
