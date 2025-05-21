export default function OrderPage() {
  return (
    <section className="p-6 md:p-10 bg-gradient-to-br from-orange-50 to-yellow-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-zinc-800">
        🛵 Order from Zomer Cafe
      </h1>

      <p className="text-center text-lg text-zinc-600 mb-10">
        Enjoy our menu at home! Order through your favorite delivery service:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center animate-fade-in">
        <a
          href="https://shopeefood.co.id"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          <img
            src="/images/shopeefood.png"
            alt="ShopeeFood"
            className="h-20 object-contain mb-4"
          />
          <span className="text-orange-500 font-semibold">ShopeeFood</span>
        </a>

        <a
          href="https://gofood.co.id"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          <img
            src="/images/gofood.png"
            alt="GoFood"
            className="h-20 object-contain mb-4"
          />
          <span className="text-green-600 font-semibold">GoFood</span>
        </a>

        <a
          href="https://food.grab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          <img
            src="/images/grabfood.png"
            alt="GrabFood"
            className="h-20 object-contain mb-4"
          />
          <span className="text-green-700 font-semibold">GrabFood</span>
        </a>
      </div>

      <div className="mt-12 text-center text-zinc-700">
        <p className="text-lg font-medium">Search for:</p>
        <p className="text-2xl font-bold text-orange-600 mt-1">Zomer Cafe</p>
      </div>
    </section>
  );
}
