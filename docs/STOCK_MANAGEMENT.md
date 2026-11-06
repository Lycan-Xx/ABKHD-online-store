# Stock Management & Auto-Deactivation

This document explains the stock management and auto-deactivation features implemented in the ABKHD store.

## Features

### 1. Stock Tracking
- Products can have a `stock` field that tracks available quantity
- Stock is displayed on product cards and detail pages
- Visual indicators show stock status:
  - **Green**: More than 5 items in stock
  - **Yellow**: 5 or fewer items in stock
  - **Red**: Out of stock

### 2. Unique Items
- Products can be marked as "Unique Item" using the `isUnique` checkbox
- Unique items are typically used/refurbished items with only 1 available
- When a unique item is purchased, it is automatically deactivated
- Unique items show "Unique Item" badge instead of stock count

### 3. Auto-Deactivation
Products are automatically deactivated (`isActive = false`) when:
- Stock reaches 0 after a purchase
- A unique item is purchased (regardless of stock)

### 4. Verified Badge
- Products can be marked as "Verified" using the `verified` checkbox
- Verified products show a blue verified badge in the shop
- Only verified items display the badge

## Appwrite Schema Requirements

Add these attributes to your `products` collection in Appwrite Console:

### 1. verified (Boolean)
- **Type**: Boolean
- **Required**: No
- **Default**: false
- **Description**: Shows verified badge on product

### 2. isUnique (Boolean)
- **Type**: Boolean
- **Required**: No
- **Default**: false
- **Description**: Marks item as unique (auto-deactivates on purchase)

### 3. stock (Integer)
- **Type**: Integer
- **Required**: No
- **Default**: 0
- **Min**: 0
- **Description**: Available quantity

## How to Add Attributes

1. Go to your Appwrite Console
2. Navigate to **Databases** > Your Database > **products** collection
3. Click the **Attributes** tab
4. Click **Create Attribute**
5. Select the appropriate type (Boolean or Integer)
6. Enter the attribute name and settings as documented above
7. Click **Create**

## Checking Schema

Run this command to check if all required attributes exist:

```bash
yarn check-schema
```

## Usage in Admin Panel

### Adding a New Product

1. Click "Add New Product" in the admin products page
2. Fill in product details
3. Set stock quantity (leave 0 for unlimited or non-tracked items)
4. Check "Unique Item" if this is a one-time purchase item
5. Check "Verified Product" to show the verified badge
6. Check "Featured Product" to feature on homepage
7. Toggle "List product in shop" to control visibility

### Stock Behavior

- **Regular items with stock**: Stock decreases with each purchase
- **Unique items**: Automatically deactivated after first purchase
- **Items without stock tracking**: No automatic deactivation

## Technical Implementation

### Stock Reduction
The `reduceProductStock()` function in `src/lib/stock-manager.ts` handles:
- Reducing stock quantity after purchase
- Auto-deactivating products when stock reaches 0
- Auto-deactivating unique items immediately

### Integration Points
Stock reduction is triggered in:
- `src/pages/checkout.astro` - After successful Squad payment
- Called automatically for all items in the cart

### Error Handling
- Stock reduction failures are logged but don't fail the order
- Orders are always created even if stock update fails
- Failed stock updates can be manually corrected in admin panel

## Best Practices

1. **For New Items**: Set appropriate stock quantity
2. **For Used Items**: Mark as "Unique Item" and set stock to 1
3. **For Digital Products**: Leave stock at 0 (unlimited)
4. **For Pre-orders**: Set stock to expected quantity
5. **Regular Audits**: Check admin panel for deactivated items

## Troubleshooting

### Product Not Deactivating
- Check if `isActive` field exists in Appwrite
- Verify stock reduction logs in browser console
- Ensure product has stock tracking enabled

### Stock Not Reducing
- Check browser console for errors
- Verify Appwrite permissions allow updates
- Check that product ID matches in cart and database

### Verified Badge Not Showing
- Ensure `verified` attribute exists in Appwrite
- Check that checkbox is checked in admin panel
- Verify product data includes `verified: true`

## Future Enhancements

Potential improvements:
- Stock reservation during checkout
- Low stock email notifications
- Bulk stock updates
- Stock history tracking
- Automatic restock notifications
