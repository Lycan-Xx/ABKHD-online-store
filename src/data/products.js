export const products = [
  {
    id: 1,
    name: "Acme Circles T-Shirt",
    price: 20.00,
    originalPrice: 25.00,
    category: "clothing",
    subcategory: "t-shirts",
    description: "A comfortable cotton t-shirt featuring our signature circles design. Perfect for everyday wear.",
    longDescription: "This premium cotton t-shirt features our iconic circles design, crafted with attention to detail and comfort. Made from 100% organic cotton, it's soft, breathable, and built to last. The minimalist design makes it perfect for any occasion.",
    image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray"],
    stock: 50,
    rating: 4.5,
    reviews: 128,
    featured: true,
    tags: ["cotton", "comfortable", "minimalist"]
  },
  {
    id: 2,
    name: "Acme Cup",
    price: 15.00,
    category: "accessories",
    subcategory: "drinkware",
    description: "A sleek ceramic cup perfect for your morning coffee or tea.",
    longDescription: "Start your day right with this beautifully crafted ceramic cup. Featuring a comfortable grip and elegant design, it's perfect for coffee, tea, or any hot beverage. Dishwasher and microwave safe.",
    image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/302900/pexels-photo-302900.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    colors: ["White", "Black", "Blue"],
    stock: 75,
    rating: 4.8,
    reviews: 89,
    featured: true,
    tags: ["ceramic", "dishwasher-safe", "elegant"]
  },
  {
    id: 3,
    name: "Acme Drawstring Bag",
    price: 12.00,
    category: "accessories",
    subcategory: "bags",
    description: "A versatile drawstring bag for all your essentials.",
    longDescription: "This durable drawstring bag is perfect for gym sessions, day trips, or everyday use. Made from high-quality materials with reinforced stitching for long-lasting durability.",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    colors: ["Black", "Navy", "Gray"],
    stock: 30,
    rating: 4.3,
    reviews: 45,
    featured: false,
    tags: ["durable", "versatile", "lightweight"]
  },
  {
    id: 4,
    name: "Acme Baby Cap",
    price: 10.00,
    category: "clothing",
    subcategory: "accessories",
    description: "A soft and comfortable cap for your little one.",
    longDescription: "Keep your baby comfortable and stylish with this soft cotton cap. Designed with care for sensitive skin and featuring an adjustable fit for growing babies.",
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    sizes: ["0-6M", "6-12M", "12-18M"],
    colors: ["Pink", "Blue", "White"],
    stock: 25,
    rating: 4.7,
    reviews: 67,
    featured: false,
    tags: ["baby", "soft", "adjustable"]
  },
  {
    id: 5,
    name: "Acme Baby Onesie",
    price: 25.00,
    category: "clothing",
    subcategory: "baby",
    description: "Ultra-soft onesie for maximum comfort.",
    longDescription: "Made from premium organic cotton, this onesie provides ultimate comfort for your baby. Features easy snap closures and is machine washable for convenience.",
    image: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    sizes: ["0-3M", "3-6M", "6-9M", "9-12M"],
    colors: ["White", "Pink", "Blue", "Yellow"],
    stock: 40,
    rating: 4.9,
    reviews: 156,
    featured: true,
    tags: ["organic", "comfortable", "easy-care"]
  },
  {
    id: 6,
    name: "Acme Hoodie",
    price: 50.00,
    originalPrice: 60.00,
    category: "clothing",
    subcategory: "hoodies",
    description: "A cozy hoodie perfect for casual wear.",
    longDescription: "Stay warm and comfortable in this premium hoodie. Made from a soft cotton blend with a spacious front pocket and adjustable drawstring hood. Perfect for layering or wearing on its own.",
    image: "https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy", "Maroon"],
    stock: 35,
    rating: 4.6,
    reviews: 92,
    featured: true,
    tags: ["cozy", "cotton-blend", "adjustable"]
  },
  {
    id: 7,
    name: "Acme Sticker",
    price: 5.00,
    category: "accessories",
    subcategory: "stickers",
    description: "High-quality vinyl sticker with our logo.",
    longDescription: "Show your style with this durable vinyl sticker. Weather-resistant and perfect for laptops, water bottles, or any smooth surface. Easy to apply and remove without residue.",
    image: "https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    colors: ["Multi"],
    stock: 100,
    rating: 4.4,
    reviews: 234,
    featured: false,
    tags: ["vinyl", "weather-resistant", "removable"]
  },
  {
    id: 8,
    name: "Acme Mug",
    price: 18.00,
    category: "accessories",
    subcategory: "drinkware",
    description: "A classic ceramic mug for your favorite beverages.",
    longDescription: "Enjoy your favorite hot beverages in this classic ceramic mug. Features a comfortable handle and smooth finish. Perfect size for coffee, tea, or hot chocolate.",
    image: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    colors: ["White", "Black", "Blue", "Red"],
    stock: 60,
    rating: 4.5,
    reviews: 78,
    featured: false,
    tags: ["ceramic", "classic", "comfortable-handle"]
  }
]

export const categories = [
  {
    id: "clothing",
    name: "Clothing",
    description: "Premium apparel for every occasion",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
    subcategories: ["t-shirts", "hoodies", "baby", "accessories"]
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look with our accessories",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
    subcategories: ["bags", "drinkware", "stickers"]
  }
]
