export function convertCurrencyCodeToSymbol(currencyCode: string): string {
    switch (currencyCode?.toUpperCase()) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      case 'AUD':
        return 'A$';
      case 'CAD':
        return 'C$';
      case 'CHF':
        return 'CHF';
      case 'CNY':
        return '¥';
      case 'NZD':
        return 'NZ$';
      case 'SEK':
        return 'kr';
      case 'KRW':
        return '₩';
      case 'INR':
        return '₹';
      case 'SGD':
        return 'S$';
      case 'HKD':
        return 'HK$';
      case 'NOK':
        return 'kr';
      case 'ZAR':
        return 'R';
      case 'NGN':
        return '₦';
      case 'EGP':
        return '£';
      case 'DZD':
        return 'د.ج';
      case 'KES':
        return 'KSh';
      case 'ETB':
        return 'Br';
      case 'GHS':
        return 'GH₵';
      case 'XOF':
        return 'CFA';
      case 'XAF':
        return 'CFA';
      case 'UGX':
        return 'USh';
      case 'RWF':
        return 'RF';
      case 'MAD':
        return 'د.م.';
      case 'PLN':
        return 'zł';
      case 'RUB':
        return '₽';
      case 'TRY':
        return '₺';
      case 'UAH':
        return '₴';
      case 'HUF':
        return 'Ft';
      case 'CZK':
        return 'Kč';
      case 'DKK':
        return 'kr';
      case 'ISK':
        return 'kr';
      // Add more cases for other currencies
      default:
        return currencyCode; // Return the code itself if symbol not found
    }
  }
  