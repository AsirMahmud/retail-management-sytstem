import Image from "next/image"

const cartItems = [
  {
    id: "1",
    name: "Gradient Graphic T-shirt",
    image: "/gradient-graphic-tshirt.jpg",
    size: "Large",
    color: "White",
    price: 145,
    quantity: 1,
  },
  {
    id: "2",
    name: "Checkered Shirt",
    image: "/checkered-shirt.jpg",
    size: "Medium",
    color: "Red",
    price: 180,
    quantity: 1,
  },
  {
    id: "3",
    name: "Skinny Fit Jeans",
    image: "/blue-skinny-jeans.jpg",
    size: "Large",
    color: "Blue",
    price: 240,
    quantity: 1,
  },
]

export function CheckoutSummary() {
  const subtotal = 565
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="border rounded-lg p-6 bg-card sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground">
                {item.size} / {item.color}
              </p>
              <p className="text-sm font-semibold mt-1">${item.price}</p>
            </div>
            <div className="text-sm text-muted-foreground">x{item.quantity}</div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">${subtotal}</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  )
}
