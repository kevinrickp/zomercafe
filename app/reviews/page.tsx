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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:4000/reviews");
        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Invalid response format");
        }

        setReviews(json.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="p-6">Loading reviews...</div>;
  }

  return (
    <section className="p-6 md:p-10 bg-gradient-to-br from-white to-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-zinc-800">
        🗣️ What Our Customers Say
      </h1>

      {reviews.length === 0 ? (
        <p className="text-center text-zinc-500">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="mb-2 text-orange-600 font-semibold">
                {review.name}
              </div>
              <p className="text-zinc-600 italic mb-2">“{review.content}”</p>

              <div className="text-yellow-500">
                {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
