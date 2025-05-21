import { db } from '@/lib/db';

export default async function ReviewsPage() {
  const [rows] = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
  const reviews = rows as any[];

  return (
    <section>
      <h1 className="text-2xl font-bold">What Our Customers Say</h1>
      {reviews.map((review) => (
        <div key={review.id} className="mt-4 border p-2 rounded">
          <p className="font-semibold">{review.name}</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </section>
  );
}
