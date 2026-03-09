import { databases, APPWRITE_DB_ID, APPWRITE_PRODUCTS_COLLECTION_ID } from './appwrite';

/**
 * Reduces stock for a product after purchase
 * Auto-deactivates if stock reaches 0 or if it's a unique item
 */
export async function reduceProductStock(productId: string, quantity: number = 1) {
  try {
    // Get current product
    const product = await databases.getDocument(
      APPWRITE_DB_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      productId
    );

    // Check if product is unique (one-time purchase item)
    if (product.isUnique) {
      // Deactivate unique items immediately after purchase
      await databases.updateDocument(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        productId,
        {
          isActive: false,
          stock: 0
        }
      );
      console.log(`Unique item ${productId} deactivated after purchase`);
      return { success: true, deactivated: true, newStock: 0 };
    }

    // For regular items with stock tracking
    if (product.stock !== undefined && product.stock !== null) {
      const newStock = Math.max(0, product.stock - quantity);
      
      const updateData: any = {
        stock: newStock
      };

      // Auto-deactivate if stock reaches 0
      if (newStock === 0) {
        updateData.isActive = false;
        console.log(`Product ${productId} deactivated - out of stock`);
      }

      await databases.updateDocument(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        productId,
        updateData
      );

      return { 
        success: true, 
        deactivated: newStock === 0, 
        newStock 
      };
    }

    // Product doesn't have stock tracking
    return { success: true, deactivated: false, newStock: null };

  } catch (error) {
    console.error('Error reducing product stock:', error);
    throw error;
  }
}

/**
 * Reduces stock for multiple products (for cart purchases)
 */
export async function reduceMultipleProductsStock(items: Array<{ productId: string, quantity: number }>) {
  const results = [];
  
  for (const item of items) {
    try {
      const result = await reduceProductStock(item.productId, item.quantity);
      results.push({ productId: item.productId, ...result });
    } catch (error) {
      console.error(`Failed to reduce stock for product ${item.productId}:`, error);
      results.push({ 
        productId: item.productId, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  
  return results;
}
