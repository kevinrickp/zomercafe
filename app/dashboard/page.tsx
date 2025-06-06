"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

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

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [activeTab, setActiveTab] = useState<"booking" | "menu" | "category">(
    "booking"
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formMenu, setFormMenu] = useState({
    name: "",
    description: "",
    image: null as File | null,
    price: "",
    categoryId: "",
  });

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

    if (activeTab === "booking") fetchReservations();
    else if (activeTab === "menu") fetchMenus();
    else if (activeTab === "category") fetchCategories();
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
        image: e.target.files![0], // file pertama
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
  if (loadingUser || !user || user.role !== "admin") {
    return <div className="p-6">Memuat...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-10 text-orange-600">Dashboard</h2>
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

      {/* Main Content */}
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
              {/* Form Tambah Menu */}
              <form
                onSubmit={handleAddMenu}
                className="mb-6 p-4 border border-zinc-300 rounded shadow-sm max-w-md"
              >
                <h3 className="text-xl font-semibold mb-4">Tambah Menu Baru</h3>

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

              {/* List Menu */}
              {menus.length === 0 ? (
                <p>Tidak ada menu.</p>
              ) : (
                <ul className="space-y-2">
                  {menus.map((m) => (
                    <li
                      key={m.id}
                      className="border p-3 rounded shadow-sm flex items-center gap-4"
                    >
                      <img
                        src={`http://localhost:4000/${m.image}`}
                        alt={m.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p>{m.description}</p>
                        <p>Harga: Rp{m.price.toLocaleString()}</p>
                        <p>Kategori ID: {m.categoryId}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {activeTab === "category" && (
            <>
              {categories.length === 0 ? (
                <p>Tidak ada kategori.</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li key={c.id} className="border p-3 rounded shadow-sm">
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
