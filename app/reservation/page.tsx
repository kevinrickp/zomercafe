"use client";

import { useState, useEffect } from "react";

type Reservation = {
  id: number;
  name: string;
  date: string; // ISO string
  people: number;
  tableNo: number;
};

// Durasi reservasi dalam jam. Bisa diubah sesuai kebutuhan (misal: 2 jam).
const RESERVATION_DURATION_HOURS = 2;

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
    if (!form.date) return alert("Please select a date and time.");

    // Payload tidak perlu diubah, karena sudah mengirim waktu lengkap
    const reservationPayload = {
      name: form.name,
      date: new Date(form.date).toISOString(),
      people: form.guests,
      tableNo: selectedTable,
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/reservations", {
        method: "POST",
        body: JSON.stringify(reservationPayload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to reserve table.");
      }

      alert("Reservation successful!");
      await fetchReservations();
      setForm({ name: "", date: "", guests: 1 });
      setSelectedTable(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const tables = Array.from({ length: 9 }, (_, i) => i + 1);

  // --- LOGIKA BARU UNTUK MEMERIKSA APAKAH MEJA SUDAH DIBOOKING ---
  const isTableBooked = (table: number): boolean => {
    if (!form.date) return false;

    // Tentukan slot waktu yang ingin dipesan oleh pengguna
    const selectionStart = new Date(form.date);
    const selectionEnd = new Date(
      selectionStart.getTime() + RESERVATION_DURATION_HOURS * 60 * 60 * 1000
    );

    // Cari apakah ada reservasi yang tumpang tindih
    return reservations.some((r) => {
      if (r.tableNo !== table) return false; // Hanya periksa meja yang sama

      // Tentukan slot waktu dari reservasi yang sudah ada
      const existingStart = new Date(r.date);
      const existingEnd = new Date(
        existingStart.getTime() + RESERVATION_DURATION_HOURS * 60 * 60 * 1000
      );

      // Kondisi tumpang tindih:
      // (MulaiA < AkhirB) dan (AkhirA > MulaiB)
      return selectionStart < existingEnd && selectionEnd > existingStart;
    });
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

          {/* DATE & TIME */}
          <div>
            <label
              htmlFor="date"
              className="block mb-2 text-zinc-700 font-semibold"
            >
              Select Date & Time
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
            disabled={loading || !selectedTable}
            className="block w-full md:w-auto mx-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="border border-zinc-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <p className="text-lg font-semibold text-orange-600">
                    {res.name}
                  </p>
                  {/* --- UBAH TAMPILAN TANGGAL & JAM DI SINI --- */}
                  <p className="text-sm text-zinc-600">
                    📅{" "}
                    {new Date(res.date).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
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
