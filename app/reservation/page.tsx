"use client";

import { useState, useEffect } from "react";

type Reservation = {
  id: number;
  name: string;
  date: string; // ISO string
  people: number;
  tableNo: number;
};

export default function ReservationPage() {
  const [form, setForm] = useState({ name: "", date: "", guests: 1 });
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:4000/reservations");
      const result = await response.json();
      setReservations(result.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return alert("Please select a table.");
    if (!form.date) return alert("Please select a date.");

    const reservationPayload = {
      name: form.name,
      date: new Date(form.date).toISOString(),
      time: "00:00:00",
      people: form.guests,
      tableNo: selectedTable,
    };

    setLoading(true);
    const response = await fetch("http://localhost:4000/reservations", {
      method: "POST",
      body: JSON.stringify(reservationPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);

    const result = await response.json();

    if (response.ok) {
      await fetchReservations();
      setForm({ name: "", date: "", guests: 1 });
      setSelectedTable(null);
    } else {
      alert("Failed to reserve table.");
    }
  };

  const tables = Array.from({ length: 9 }, (_, i) => i + 1);

  const getDateOnly = (dateStr: string) =>
    new Date(dateStr).toISOString().split("T")[0];

  const isTableBooked = (table: number): boolean => {
    if (!form.date) return false;
    const selectedDate = form.date;
    return reservations.some(
      (r) => r.tableNo === table && getDateOnly(r.date) === selectedDate
    );
  };

  return (
    <div className="min-h-screen bg-white text-zinc-800 px-6 sm:px-10 lg:px-16 py-10 font-sans">
      <section className="w-full max-w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-zinc-900">
          Reserve Your Table
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-zinc-700 font-semibold"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              value={form.name}
              required
              className="p-3 border border-zinc-300 rounded w-full placeholder-zinc-500 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* DATE */}
          <div>
            <label
              htmlFor="date"
              className="block mb-2 text-zinc-700 font-semibold"
            >
              Select Date
            </label>
            <input
              id="date"
              type="datetime-local"
              value={form.date}
              required
              className="p-3 border border-zinc-300 rounded w-full text-zinc-600 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => {
                setForm({ ...form, date: e.target.value });
                setSelectedTable(null);
              }}
            />
          </div>

          {/* GUESTS */}
          <div>
            <label
              htmlFor="guests"
              className="block mb-2 text-zinc-700 font-semibold"
            >
              Number of Guests
            </label>
            <input
              id="guests"
              type="number"
              min="1"
              value={form.guests}
              required
              placeholder="Number of Guests"
              className="p-3 border border-zinc-300 rounded w-full placeholder-zinc-500 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setForm({ ...form, guests: +e.target.value })}
            />
          </div>

          {/* TABLE SELECTION */}
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-3 text-zinc-800 text-center md:text-left">
              Choose Your Table
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto md:mx-0">
              {tables.map((table) => {
                const booked = isTableBooked(table);
                const isSelected = selectedTable === table;
                return (
                  <button
                    key={table}
                    type="button"
                    disabled={booked}
                    onClick={() => !booked && setSelectedTable(table)}
                    className={`rounded-lg py-8 text-center font-medium text-xl transition-all duration-300 select-none
                      ${
                        booked
                          ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                          : isSelected
                          ? "bg-orange-500 text-white scale-105 shadow-lg"
                          : "bg-zinc-100 hover:bg-orange-100 text-zinc-700"
                      }`}
                  >
                    Table {table}
                    {booked && <div className="text-sm mt-2">(Booked)</div>}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="block w-full md:w-auto mx-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded transition-all duration-300 mt-8 disabled:opacity-50"
          >
            {loading ? "Reserving..." : "Confirm Reservation"}
          </button>
        </form>

        {/* DAFTAR RESERVASI */}
        <div className="mt-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 text-center">
            Current Reservations
          </h2>
          {reservations.length === 0 ? (
            <p className="text-zinc-500 text-center">No reservations yet.</p>
          ) : (
            <div className="grid gap-5">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="border border-zinc-200 p-5 rounded shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <p className="text-lg font-semibold text-orange-600">
                    {res.name}
                  </p>
                  <p className="text-sm text-zinc-600">
                    📅 {new Date(res.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-zinc-600">
                    👥 {res.people} guests
                  </p>
                  <p className="text-sm text-zinc-600">
                    🪑 Table {res.tableNo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
