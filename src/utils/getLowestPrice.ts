interface Price {
  price: string | number; // Change type to string | number to allow for both types
}

export function getLowestPrice(prices: Price[]): number | string {
  if (!prices || prices.length === 0) {
    return "Free"; // Return 'Free' if prices array is empty or undefined
  }

  let lowestPrice: number | undefined = undefined;

  for (let i = 0; i < prices.length; i++) {
    // Parse price as a number if it's a string
    const currentPrice = typeof prices[i].price === 'string' ? parseFloat(prices[i].price as string) : prices[i].price as number;
    if (currentPrice === 0) {
      return "Free"; // Return 'Free' if any price is zero
    }
    if (lowestPrice === undefined || currentPrice < lowestPrice) {
      lowestPrice = currentPrice;
    }
  }

  if (lowestPrice !== undefined) {
    return lowestPrice;
  } else {
    return "Free"; // Return 'Free' if prices array does not contain a valid price
  }
}
