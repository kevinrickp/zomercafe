type Props = {
    name: string;
    description: string;
    price: number;
  };
  
  export default function MenuItemCard({ name, description, price }: Props) {
    return (
      <div className="p-4 border rounded shadow-sm hover:shadow-md transition">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-1 font-bold text-blue-600">${price.toFixed(2)}</p>
      </div>
    );
  }
  