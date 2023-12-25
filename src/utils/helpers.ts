export function extractUniqueTypes<T>(arr: T[], ppty: keyof T): T[keyof T][] {
  const uniqueTypesSet = new Set<T[keyof T]>(
    arr.flatMap((obj) => {
      const value = obj[ppty];
      return value != null ? (Array.isArray(value) ? value : [value]) : [];
    })
  );

  return Array.from(uniqueTypesSet);
}
