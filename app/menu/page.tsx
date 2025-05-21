import { db } from '@/lib/db';

export default async function MenuPage() {
  const [rows] = await db.query('SELECT * FROM menu ORDER BY category, name');
  const menu = rows as any[];

  const groupedMenu = menu.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

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
              {(items as any[]).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-5 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <h3 className="text-xl font-medium text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.description || 'No description'}
                  </p>

                  <p className="mt-3 text-right font-semibold text-orange-600">
                    Rp {Number(item.price).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
