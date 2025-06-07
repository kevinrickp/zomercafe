"use client";

import { useEffect, useState } from "react";

interface Review {
  id: number;
  name: string;
  content: string;
  rating: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/reviews");
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) {
        throw new Error("Invalid response format");
      }
      setReviews(json.data.sort((a: Review, b: Review) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, content, rating }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to submit review.");
      }

      fetchReviews();

      setName("");
      setContent("");
      setRating(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6 md:p-10 bg-gradient-to-br from-white to-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-zinc-800">
        🗣️ What Our Customers Say
      </h1>

      {/* --- FORM DIKEMBALIKAN KE LAYOUT ATAS-BAWAH --- */}
      {/* Class untuk centering dan max-width dikembalikan */}
      <div className="max-w-2xl mx-auto mb-12 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-zinc-800">
          Leave Your Review
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Isi form tidak berubah */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-zinc-700 font-semibold mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-zinc-700 font-semibold mb-2"
            >
              Your Review
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              htmlFor="rating"
              className="block text-zinc-700 font-semibold mb-2"
            >
              Rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="5">5 Stars ★★★★★</option>
              <option value="4">4 Stars ★★★★☆</option>
              <option value="3">3 Stars ★★★☆☆</option>
              <option value="2">2 Stars ★★☆☆☆</option>
              <option value="1">1 Star ★☆☆☆☆</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition disabled:bg-zinc-400"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* --- DAFTAR REVIEW (KOMENTAR) DI BAWAH FORM --- */}
      {loading ? (
        <p className="text-center text-zinc-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-zinc-500">
          No reviews yet. Be the first to leave one!
        </p>
      ) : (
        // Grid dikembalikan ke 3 kolom di layar besar
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col"
            >
              <div className="mb-2 text-orange-600 font-semibold">
                {review.name}
              </div>
              <p className="text-zinc-600 italic mb-4 flex-grow">
                “{review.content}”
              </p>
              <div className="text-yellow-500 mt-auto">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
