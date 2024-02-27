export function convertStringToBigInt(uuidString: string): bigint {
    // Remove hyphens from the UUID string
    const cleanedUuid: string = uuidString.replace(/-/g, '');
  
    // Convert the cleaned UUID string to a BigInt
    const uuidBigInt: bigint = BigInt('0x' + cleanedUuid);
  
    return uuidBigInt;
  }