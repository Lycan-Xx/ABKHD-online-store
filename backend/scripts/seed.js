const strapi = require('@strapi/strapi');

async function seed() {
  console.log('🌱 Starting database seeding...');
  
  let app;
  try {
    // Initialize Strapi application
    app = await strapi({
      // Ensure we're in the correct directory
      dir: process.cwd(),
    }).load();

    console.log('✅ Strapi loaded successfully');

    // Wait a moment for services to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if entityService is available
    if (!app.entityService) {
      throw new Error('EntityService not available. Make sure your Strapi content types are properly defined.');
    }

    // Create categories
    const categories = [
      {
        name: 'Mobile Phones',
        description: 'Latest smartphones and mobile devices',
        publishedAt: new Date(),
      },
      {
        name: 'Laptops',
        description: 'High-performance laptops for work and play',
        publishedAt: new Date(),
      },
      {
        name: 'Accessories',
        description: 'Complete your setup with our accessories',
        publishedAt: new Date(),
      },
    ];

    console.log('📱 Creating categories...');
    const createdCategories = {};
    
    for (const categoryData of categories) {
      try {
        const category = await app.entityService.create('api::category.category', {
          data: categoryData,
        });
        createdCategories[category.name] = category;
        console.log(`✅ Created category: ${category.name} (ID: ${category.id})`);
      } catch (error) {
        console.error(`❌ Failed to create category ${categoryData.name}:`, error.message);
        throw error;
      }
    }

    // Create products
    const products = [
      {
        name: 'Acme X1 Mobile Phone',
        description: 'A powerful smartphone with a stunning display and long battery life.',
        longDescription: 'The Acme X1 features a 6.5-inch AMOLED display, 128GB storage, and a 5000mAh battery. Enjoy fast performance and a premium camera experience.',
        price: 120000.00,
        originalPrice: 135000.00,
        stock: 30,
        featured: true,
        tags: ['smartphone', 'android', 'mobile'],
        category: createdCategories['Mobile Phones'].id,
        publishedAt: new Date(),
      },
      {
        name: 'Acme Mini Mobile',
        description: 'A compact and reliable feature phone.',
        longDescription: 'Perfect for calls and texts, the Acme Mini offers a long-lasting battery and simple interface for everyday use.',
        price: 80000.00,
        stock: 50,
        featured: false,
        tags: ['feature phone', 'mobile', 'compact'],
        category: createdCategories['Mobile Phones'].id,
        publishedAt: new Date(),
      },
      {
        name: 'AcmeBook Pro 15',
        description: 'A high-performance laptop for professionals.',
        longDescription: 'AcmeBook Pro 15 features a 15-inch Retina display, 16GB RAM, 512GB SSD, and a powerful processor for demanding tasks.',
        price: 250000.00,
        originalPrice: 270000.00,
        stock: 20,
        featured: true,
        tags: ['laptop', 'ultrabook', 'professional'],
        category: createdCategories['Laptops'].id,
        publishedAt: new Date(),
      },
      {
        name: 'AcmeBook Air 13',
        description: 'Lightweight and portable laptop for everyday use.',
        longDescription: 'The AcmeBook Air 13 is perfect for students and travelers, featuring a slim design, 8GB RAM, and 256GB SSD.',
        price: 180000.00,
        stock: 25,
        featured: false,
        tags: ['laptop', 'portable', 'student'],
        category: createdCategories['Laptops'].id,
        publishedAt: new Date(),
      },
      {
        name: 'Acme Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life.',
        longDescription: 'Enjoy smooth and precise control with the Acme Wireless Mouse, featuring a comfortable grip and up to 12 months of battery life.',
        price: 10000.00,
        stock: 60,
        featured: true,
        tags: ['accessory', 'mouse', 'wireless'],
        category: createdCategories['Accessories'].id,
        publishedAt: new Date(),
      },
      {
        name: 'Acme Laptop Sleeve',
        description: 'Protective sleeve for laptops up to 15 inches.',
        longDescription: 'Keep your laptop safe from scratches and bumps with this stylish and durable sleeve.',
        price: 15000.00,
        stock: 40,
        featured: false,
        tags: ['accessory', 'laptop', 'sleeve'],
        category: createdCategories['Accessories'].id,
        publishedAt: new Date(),
      },
    ];

    console.log('🛍️ Creating products...');
    for (const productData of products) {
      try {
        const product = await app.entityService.create('api::product.product', {
          data: productData,
        });
        console.log(`✅ Created product: ${product.name} (ID: ${product.id})`);
      } catch (error) {
        console.error(`❌ Failed to create product ${productData.name}:`, error.message);
        throw error;
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary: ${categories.length} categories and ${products.length} products created`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  } finally {
    // Always try to close Strapi gracefully
    if (app) {
      try {
        await app.destroy();
        console.log('✅ Strapi closed gracefully');
      } catch (closeError) {
        console.error('⚠️ Error closing Strapi:', closeError.message);
      }
    }
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Seeding interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Seeding terminated');
  process.exit(0);
});

seed();