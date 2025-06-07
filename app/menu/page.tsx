"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
};

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:4000/menus");
        const json = await res.json();

        // Jika respons dalam format { data: [...] }
        const data = Array.isArray(json) ? json : json.data;

        // Jika tetap bukan array, lempar error
        if (!Array.isArray(data)) {
          throw new Error("Invalid menu data format");
        }

        setMenu(data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setMenu([]); // fallback biar reduce gak error
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const groupedMenu = menu.reduce((acc: Record<string, MenuItem[]>, item) => {
    const category = item.category?.name || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-10 text-orange-500">Loading menu...</div>
    );
  }

  return (
    <section className="p-6 md:p-10 bg-gradient-to-br from-orange-50 to-yellow-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-zinc-800">
        🍽️ Our Menu
      </h1>

      <div className="space-y-12 animate-fade-in">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b border-orange-300 pb-1">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  {item.image && (
                    <img
                      src={`http://localhost:4000/${item.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-zinc-800 mb-1">
                      {item.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {item.description || "No description available."}
                    </p>

                    <p className="mt-4 text-right text-orange-600 font-bold">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
