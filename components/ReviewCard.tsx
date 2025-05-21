type Props = {
    name: string;
    comment: string;
    date?: string;
  };
  
  export default function ReviewCard({ name, comment, date }: Props) {
    return (
      <div className="border p-4 rounded bg-white shadow-sm mb-4">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-zinc-800">{name}</p>
          {date && <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>}
        </div>
        <p className="text-sm text-gray-700">{comment}</p>
      </div>
    );
  }
  