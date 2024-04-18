interface Price {
  price: number;
}


export function getLowestPrice(prices: Price[]): number | string {
  if (!prices || prices.length === 0) {
    return "Free"; // Return 'Free' if prices array is empty or undefined
  }

  let lowestPrice: number = prices[0].price; // Initialize lowest price with the first element

  for (let i = 1; i < prices.length; i++) {
    if (prices[i].price < lowestPrice) {
      lowestPrice = prices[i].price;
    }
  }

  return lowestPrice;
}
