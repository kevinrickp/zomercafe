'use client';

import { useState, useEffect } from 'react';

type Reservation = {
  id: number;
  name: string;
  date: string;
  guests: number;
  table: number;
};

export default function ReservationPage() {
  const [form, setForm] = useState({ name: '', date: '', guests: 1 });
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservation');
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  if (!selectedTable) return alert("Please select a table.");

  const reservationPayload = {
    name: form.name,
    date: form.date,
    time: '00:00:00', // default time jika tidak dipilih oleh user
    guests: form.guests,
    table: selectedTable,
  };

  const response = await fetch('/api/reservation', {
    method: 'POST',
    body: JSON.stringify(reservationPayload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (response.ok) {
    setReservations((prev) => [
      { id: result.id, ...reservationPayload },
      ...prev,
    ]);
    setForm({ name: '', date: '', guests: 1 });
    setSelectedTable(null);
  } else {
    alert('Failed to reserve table.');
  }
};


  const tables = Array.from({ length: 9 }, (_, i) => i + 1); // Table 1–9

  return (
    <div className="min-h-screen bg-white text-zinc-800 px-4 py-10 font-sans">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-zinc-900">Reserve Your Table</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Your Name"
              value={form.name}
              required
              className="p-3 border border-zinc-300 rounded w-full placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="date"
              value={form.date}
              required
              className="p-3 border border-zinc-300 rounded w-full text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              min="1"
              value={form.guests}
              required
              placeholder="Number of Guests"
              className="p-3 border border-zinc-300 rounded w-full placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setForm({ ...form, guests: +e.target.value })}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-4 text-zinc-800">Choose Your Table</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {tables.map((table) => (
                <button
                  key={table}
                  type="button"
                  onClick={() => setSelectedTable(table)}
                  className={`rounded-lg p-6 text-center font-medium transition-all duration-300 text-sm
                    ${selectedTable === table
                        ? 'bg-orange-500 text-white scale-105 shadow-lg'
                        : 'bg-zinc-100 hover:bg-orange-100 text-zinc-700'
                    }`}
                >
                  Table {table}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="block w-full md:w-auto mx-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded transition-all duration-300 mt-6"
          >
            Confirm Reservation
          </button>
        </form>

        {/* DAFTAR RESERVASI */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900">Current Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-zinc-500">No reservations yet.</p>
          ) : (
            <div className="grid gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="border border-zinc-200 p-4 rounded shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <p className="text-lg font-semibold text-orange-600">{res.name}</p>
                  <p className="text-sm text-zinc-600">📅 {res.date}</p>
                  <p className="text-sm text-zinc-600">👥 {res.guests} guests</p>
                  <p className="text-sm text-zinc-600">🪑 Table {res.table}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
