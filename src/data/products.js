export const products = [
  // Mobile Phones
  {
    id: 1,
    name: "Acme X1 Mobile Phone",
    price: 120000.00,
    originalPrice: 135000.00,
    category: "mobile phones",
    description: "A powerful smartphone with a stunning display and long battery life.",
    longDescription: "The Acme X1 features a 6.5-inch AMOLED display, 128GB storage, and a 5000mAh battery. Enjoy fast performance and a premium camera experience.",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 30,
    // rating: 4.7,
    // reviews: 210,
    featured: true,
    tags: ["smartphone", "android", "mobile"]
  },
  {
    id: 2,
    name: "Acme Mini Mobile",
    price: 80000.00,
    category: "mobile phones",
    description: "A compact and reliable feature phone.",
    longDescription: "Perfect for calls and texts, the Acme Mini offers a long-lasting battery and simple interface for everyday use.",
    image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 50,
    // rating: 4.2,
    // reviews: 98,
    featured: false,
    tags: ["feature phone", "mobile", "compact"]
  },
  // Laptops
  {
    id: 3,
    name: "AcmeBook Pro 15",
    price: 250000.00,
    originalPrice: 270000.00,
    category: "laptops",
    description: "A high-performance laptop for professionals.",
    longDescription: "AcmeBook Pro 15 features a 15-inch Retina display, 16GB RAM, 512GB SSD, and a powerful processor for demanding tasks.",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://unsplash.com/photos/silver-macbook-iCxPxfBlvlg"
    ],
    stock: 20,
    // rating: 4.8,
    // reviews: 150,
    featured: true,
    tags: ["laptop", "ultrabook", "professional"]
  },
  {
    id: 4,
    name: "AcmeBook Air 13",
    price: 180000.00,
    category: "laptops",
    description: "Lightweight and portable laptop for everyday use.",
    longDescription: "The AcmeBook Air 13 is perfect for students and travelers, featuring a slim design, 8GB RAM, and 256GB SSD.",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 25,
    // rating: 4.5,
    // reviews: 110,
    featured: false,
    tags: ["laptop", "portable", "student"]
  },
  // Accessories
  {
    id: 5,
    name: "Acme Wireless Mouse",
    price: 10000.00,
    category: "accessories",
    description: "Ergonomic wireless mouse with long battery life.",
    longDescription: "Enjoy smooth and precise control with the Acme Wireless Mouse, featuring a comfortable grip and up to 12 months of battery life.",
    image: "https://images.pexels.com/photos/1580896/pexels-photo-1580896.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1580896/pexels-photo-1580896.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 60,
    // rating: 4.6,
    // reviews: 80,
    featured: true,
    tags: ["accessory", "mouse", "wireless"]
  },
  {
    id: 6,
    name: "Acme Laptop Sleeve",
    price: 15000.00,
    category: "accessories",
    description: "Protective sleeve for laptops up to 15 inches.",
    longDescription: "Keep your laptop safe from scratches and bumps with this stylish and durable sleeve.",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 40,
    // rating: 4.4,
    // reviews: 60,
    featured: false,
    tags: ["accessory", "laptop", "sleeve"]
  }
]

export const categories = [
  {
    id: "mobile phones",
    name: "Mobile Phones",
    description: "Latest smartphones and mobile devices",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
    subcategories: ["t-shirts", "hoodies", "baby", "accessories"]
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look with our accessories",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
    subcategories: ["bags", "drinkware", "stickers"]
  },
  {
    id: "laptops",
    name: "Laptops",
    description: "High-performance laptops for work and play",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    subcategories: ["bags", "drinkware"]
  }
]
