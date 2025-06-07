"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Definisi tipe data
type User = {
  id: number;
  username: string;
  role: string;
};
type Reservation = {
  id: number;
  name: string;
  tableNo: number;
  people: number;
  date: string;
};
type Category = {
  id: number;
  name: string;
};
type Menu = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  categoryId: number;
};

export default function Dashboard() {
  const router = useRouter();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<"booking" | "menu" | "category">(
    "category" // Default ke tab kategori untuk kemudahan
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State untuk form & modal Menu
  const [formMenu, setFormMenu] = useState({
    name: "",
    description: "",
    image: null as File | null,
    price: "",
    categoryId: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // State untuk form & modal Kategori
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    if (!loadingUser && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, loadingUser, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    setError(null);
    setSuccess(null);

    if (activeTab === "booking") fetchReservations();
    else if (activeTab === "menu") {
      fetchMenus();
      fetchCategories();
    } else if (activeTab === "category") fetchCategories();
  }, [activeTab, user]);

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/reservations");
      const json = await res.json();
      setReservations(json.data || []);
    } catch {
      setError("Gagal memuat data reservasi.");
    }
    setLoading(false);
  }

  async function fetchMenus() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/menus");
      const json = await res.json();
      setMenus(json.data || []);
    } catch {
      setError("Gagal memuat menu.");
    }
    setLoading(false);
  }

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/categories");
      const json = await res.json();
      setCategories(json.data || []);
    } catch {
      setError("Gagal memuat kategori.");
    }
    setLoading(false);
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (
      name === "image" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      setFormMenu((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    } else {
      setFormMenu((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleAddMenu(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (
      !formMenu.name ||
      !formMenu.description ||
      !formMenu.image ||
      !formMenu.price ||
      !formMenu.categoryId
    ) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", formMenu.name);
    formData.append("description", formMenu.description);
    formData.append("image", formMenu.image);
    formData.append("price", formMenu.price);
    formData.append("categoryId", formMenu.categoryId);
    try {
      const res = await fetch("http://localhost:4000/menus", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal menambahkan menu.");
      await fetchMenus();
      setFormMenu({
        name: "",
        description: "",
        image: null,
        price: "",
        categoryId: "",
      });
      setSuccess("Menu berhasil ditambahkan.");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    }
    setLoading(false);
  }

  async function handleDeleteMenu(menuId: number) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`http://localhost:4000/menus/${menuId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Gagal menghapus menu.");
      }
      setSuccess("Menu berhasil dihapus.");
      setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== menuId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMenu(e: FormEvent) {
    e.preventDefault();
    if (!editingMenu) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const updatedData = {
      name: editingMenu.name,
      description: editingMenu.description,
      price: editingMenu.price,
      categoryId: editingMenu.categoryId,
      image: editingMenu.image,
    };
    try {
      const res = await fetch(`http://localhost:4000/menus/${editingMenu.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error("Gagal mengupdate menu.");
      }
      setSuccess("Menu berhasil diperbarui.");
      setIsEditModalOpen(false);
      setEditingMenu(null);
      fetchMenus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Nama kategori tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("http://localhost:4000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Gagal menambahkan kategori.");
      setSuccess("Kategori berhasil ditambahkan.");
      setNewCategoryName("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    if (
      !window.confirm(
        "Yakin ingin menghapus kategori ini? Menghapus kategori juga akan gagal jika masih ada menu yang menggunakannya."
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `http://localhost:4000/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Gagal menghapus kategori.");
      }
      setSuccess("Kategori berhasil dihapus.");
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCategory(e: FormEvent) {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      setError("Nama kategori tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `http://localhost:4000/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editingCategory.name }),
        }
      );
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Gagal mengupdate kategori.");
      setSuccess("Kategori berhasil diperbarui.");
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser || !user || user.role !== "admin") {
    return <div className="p-6">Memuat...</div>;
  }

  return (
    <>
      <div className="min-h-screen flex bg-white text-zinc-900 font-sans">
        <aside className="w-64 bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-10 text-orange-600">
            Dashboard
          </h2>
          <nav className="flex flex-col space-y-4">
            {["booking", "menu", "category"].map((tab) => (
              <button
                key={tab}
                className={`text-left text-lg font-semibold px-4 py-2 rounded ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "hover:bg-orange-100"
                }`}
                onClick={() => setActiveTab(tab as any)}
              >
                Manage {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
                router.push("/login");
              }}
              className="mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 max-w-7xl mx-auto overflow-auto">
          {loading && (
            <div className="mb-4 text-orange-500 font-semibold">Loading...</div>
          )}
          {error && (
            <div className="mb-4 text-red-600 font-semibold">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 font-semibold">{success}</div>
          )}

          <div className="mt-4 text-zinc-700">
            {activeTab === "booking" && (
              <>
                {reservations.length === 0 ? (
                  <p>Tidak ada booking.</p>
                ) : (
                  <ul className="space-y-2">
                    {reservations.map((r) => (
                      <li key={r.id} className="border p-3 rounded shadow-sm">
                        <p className="font-semibold">{r.name}</p>
                        <p>Table: {r.tableNo}</p>
                        <p>Jumlah orang: {r.people}</p>
                        <p>Tanggal: {new Date(r.date).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {activeTab === "menu" && (
              <>
                <form
                  onSubmit={handleAddMenu}
                  className="mb-6 p-4 border border-zinc-300 rounded shadow-sm max-w-md"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Tambah Menu Baru
                  </h3>
                  <div className="mb-3">
                    <label htmlFor="name" className="block font-medium mb-1">
                      Nama Menu
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formMenu.name}
                      onChange={handleInputChange}
                      className="w-full border border-zinc-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="description"
                      className="block font-medium mb-1"
                    >
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formMenu.description}
                      onChange={handleInputChange}
                      className="w-full border border-zinc-300 rounded px-3 py-2"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="block font-medium mb-1">
                      Gambar Menu
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full border border-zinc-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="block font-medium mb-1">
                      Harga (Rp)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formMenu.price}
                      onChange={handleInputChange}
                      className="w-full border border-zinc-300 rounded px-3 py-2"
                      min={0}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="categoryId"
                      className="block font-medium mb-1"
                    >
                      Kategori
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formMenu.categoryId}
                      onChange={handleInputChange}
                      className="w-full border border-zinc-300 rounded px-3 py-2"
                      required
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    Tambah Menu
                  </button>
                </form>

                <hr className="my-8" />

                <h3 className="text-xl font-semibold mb-4">Daftar Menu</h3>
                {menus.length === 0 ? (
                  <p>Tidak ada menu.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((m) => (
                      <div
                        key={m.id}
                        className="border p-4 rounded-lg shadow-sm flex flex-col bg-white"
                      >
                        <img
                          src={`http://localhost:4000/${m.image.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt={m.name}
                          className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-lg">{m.name}</p>
                          <p className="text-sm text-zinc-600 mb-2">
                            {m.description}
                          </p>
                          <p className="font-semibold text-orange-600">
                            Rp{m.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                          <button
                            onClick={() => {
                              setEditingMenu(m);
                              setIsEditModalOpen(true);
                            }}
                            className="flex-1 bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(m.id)}
                            className="flex-1 bg-red-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "category" && (
              <>
                <form
                  onSubmit={handleAddCategory}
                  className="mb-6 p-4 border border-zinc-300 rounded shadow-sm max-w-md"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Tambah Kategori Baru
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Nama Kategori"
                      className="flex-grow border border-zinc-300 rounded px-3 py-2"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                    >
                      {loading ? "..." : "Tambah"}
                    </button>
                  </div>
                </form>

                <hr className="my-8" />

                <h3 className="text-xl font-semibold mb-4">Daftar Kategori</h3>
                {categories.length === 0 ? (
                  <p>Tidak ada kategori.</p>
                ) : (
                  <div className="space-y-3">
                    {categories.map((c) => (
                      <div
                        key={c.id}
                        className="border p-3 rounded-lg shadow-sm flex justify-between items-center bg-white"
                      >
                        <span className="font-medium">{c.name}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingCategory(c);
                              setIsCategoryModalOpen(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {isEditModalOpen && editingMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Menu</h3>
            <form onSubmit={handleUpdateMenu}>
              <div className="mb-3">
                <label htmlFor="edit-name" className="block font-medium mb-1">
                  Nama Menu
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editingMenu.name}
                  onChange={(e) =>
                    setEditingMenu({ ...editingMenu, name: e.target.value })
                  }
                  className="w-full border border-zinc-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-desc" className="block font-medium mb-1">
                  Deskripsi
                </label>
                <textarea
                  id="edit-desc"
                  rows={3}
                  value={editingMenu.description}
                  onChange={(e) =>
                    setEditingMenu({
                      ...editingMenu,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-zinc-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-price" className="block font-medium mb-1">
                  Harga
                </label>
                <input
                  id="edit-price"
                  type="number"
                  value={editingMenu.price}
                  onChange={(e) =>
                    setEditingMenu({
                      ...editingMenu,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full border border-zinc-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-category"
                  className="block font-medium mb-1"
                >
                  Kategori
                </label>
                <select
                  id="edit-category"
                  value={editingMenu.categoryId}
                  onChange={(e) =>
                    setEditingMenu({
                      ...editingMenu,
                      categoryId: Number(e.target.value),
                    })
                  }
                  className="w-full border border-zinc-300 rounded px-3 py-2"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-zinc-200 text-zinc-800 px-4 py-2 rounded hover:bg-zinc-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Kategori</h3>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label
                  htmlFor="edit-cat-name"
                  className="block font-medium mb-1"
                >
                  Nama Kategori
                </label>
                <input
                  id="edit-cat-name"
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-zinc-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="bg-zinc-200 text-zinc-800 px-4 py-2 rounded hover:bg-zinc-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
