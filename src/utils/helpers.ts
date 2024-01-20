export function extractUniqueTypes<T>(
  arr: T[],
  ppty: keyof T
): { label: string; value: string }[] {
  const uniqueTypesSet = new Set<string>(
    arr.flatMap((obj) => {
      const value = obj[ppty];
      return value != null ? (Array.isArray(value) ? value : [value]) : [];
    })
  );

  return Array.from(uniqueTypesSet).map((value) => ({
    label: value,
    value,
  }));
}

type CamelCaseObject = { [key: string]: any };

export function convertCamelToNormal<T extends CamelCaseObject>(
  data: T[],
  separator: "-" | "_" | " "
): T[] {
  return data.map((item) => {
    const convertedItem: CamelCaseObject = {};

    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const newKey = key
          .replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
          .toLowerCase();

        convertedItem[newKey] = item[key];
      }
    }

    return convertedItem as T;
  });
}

export function calculateAndSetMaxHeight(
  divRef: React.RefObject<HTMLDivElement>
) {
  const div = divRef.current;

  if (div) {
    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    // Set the maximum height of the div
    div.style.maxHeight = `${distanceToBottom}px`;
  }
}

export function generateAlphanumericHash(length: number): string {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const hashLength = length || 18;
  let hash = "";

  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters.charAt(randomIndex);
  }

  return hash;
}

export function getProperty<T>(obj: T, key: string): any {
  if (typeof obj === "object" && obj !== null && key in obj) {
    return (obj as Record<string, any>)[key];
  }
  return null; // Handle the case where the key is not present
}

export function areAllPropertiesSet(obj: Record<string, any>): boolean {
  for (const key in obj) {
    if (
      (obj.hasOwnProperty(key) && obj[key] === undefined) ||
      obj[key] === null ||
      obj[key] === ""
    ) {
      return false;
    }
  }
  return true;
}
