export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  category: string
  description: string
  longDescription?: string
  image: string
  images?: string[]
  stock: number
  featured: boolean
  tags: string[]
}

export const categories: Category[] = [
  {
    id: "computers",
    name: "Computers",
    description: "Laptops, desktops, and computer accessories",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "mobile phones",
    name: "Mobile Phones",
    description: "Smartphones and mobile devices",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Phone cases, chargers, headphones, and more",
    image: "https://images.pexels.com/photos/1580896/pexels-photo-1580896.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
]

export const products: Product[] = [
  // Computers
  {
    id: 1,
    name: "ProBook 15 Laptop",
    price: 350000.00,
    originalPrice: 400000.00,
    category: "computers",
    description: "High-performance laptop with 15.6-inch display, 16GB RAM, 512GB SSD.",
    longDescription: "The ProBook 15 features a powerful processor, ample storage, and a stunning Full HD display. Perfect for professionals and students alike.",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 15,
    featured: true,
    tags: ["laptop", "computer", "portable"]
  },
  {
    id: 2,
    name: "UltraSlim Desktop",
    price: 280000.00,
    category: "computers",
    description: "Compact desktop computer for home and office use.",
    longDescription: "Space-saving design with powerful performance. Includes keyboard and mouse.",
    image: "https://images.pexels.com/photos/442579/pexels-photo-442579.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/442579/pexels-photo-442579.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 10,
    featured: false,
    tags: ["desktop", "computer", "office"]
  },
  // Mobile Phones
  {
    id: 3,
    name: "Galaxy X Pro Smartphone",
    price: 250000.00,
    originalPrice: 280000.00,
    category: "mobile phones",
    description: "Flagship smartphone with 6.7-inch AMOLED display, 256GB storage.",
    longDescription: "Experience the latest in mobile technology with stunning visuals, powerful performance, and an amazing camera system.",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 25,
    featured: true,
    tags: ["smartphone", "phone", "android"]
  },
  {
    id: 4,
    name: "Budget Phone A12",
    price: 85000.00,
    category: "mobile phones",
    description: "Affordable smartphone with great features.",
    longDescription: "Perfect for everyday use with reliable performance and long battery life.",
    image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 40,
    featured: false,
    tags: ["smartphone", "phone", "budget"]
  },
  // Accessories
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 25000.00,
    originalPrice: 35000.00,
    category: "accessories",
    description: "Premium wireless earbuds with active noise cancellation.",
    longDescription: "Immersive sound quality with up to 30 hours of battery life.",
    image: "https://images.pexels.com/photos/1580896/pexels-photo-1580896.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1580896/pexels-photo-1580896.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 50,
    featured: true,
    tags: ["earbuds", "headphones", "wireless"]
  },
  {
    id: 6,
    name: "Fast Charger 65W",
    price: 12000.00,
    category: "accessories",
    description: "Universal fast charger compatible with all devices.",
    longDescription: "Quick charge your devices with this powerful and safe charger.",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 100,
    featured: false,
    tags: ["charger", "accessory", "fast charge"]
  },
  {
    id: 7,
    name: "Premium Phone Case",
    price: 5000.00,
    category: "accessories",
    description: "Protective phone case with premium finish.",
    longDescription: "Shock-resistant protection with sleek design.",
    image: "https://images.pexels.com/photos/2332522/pexels-photo-2332522.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/2332522/pexels-photo-2332522.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 80,
    featured: false,
    tags: ["case", "phone", "protection"]
  },
  {
    id: 8,
    name: "Wireless Mouse",
    price: 8000.00,
    category: "accessories",
    description: "Ergonomic wireless mouse for computers.",
    longDescription: "Smooth tracking and comfortable grip for extended use.",
    image: "https://images.pexels.com/photos/163204/pexels-photo-163204.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/163204/pexels-photo-163204.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 60,
    featured: false,
    tags: ["mouse", "wireless", "computer"]
  }
]