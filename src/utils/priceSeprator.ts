export function addCommasToPrice(price: number): string {
    // Convert the number to a string
    let priceString: string = price.toString();

    // Split the string into integer and fractional parts, if any
    let parts: string[] = priceString.split('.');
    let integerPart: string = parts[0];
    let fractionalPart: string = parts.length > 1 ? '.' + parts[1] : '';

    // Add commas to the integer part
    let formattedIntegerPart: string = '';
    let integerLength: number = integerPart.length;
    for (let i = 0; i < integerLength; i++) {
        if (i > 0 && (integerLength - i) % 3 === 0) {
            formattedIntegerPart += ',';
        }
        formattedIntegerPart += integerPart[i];
    }

    // Concatenate the formatted integer part and the fractional part
    let formattedPrice: string = formattedIntegerPart + fractionalPart;

    return formattedPrice;
}