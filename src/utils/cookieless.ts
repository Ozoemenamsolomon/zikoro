const setLocalStorageItem = (key: string, data: any) => {
  window.localStorage.setItem(key, JSON.stringify(data));
  return;
};

const getLocalStorageItem = (key: string, data: any) => {
  const itemData = window.localStorage.getItem(key);
  if (itemData !== null) {
    return JSON.parse(itemData);
  }
  return null; // or handle the null case as per your requirement
};

const removeLocalStorageItem = (key: string, data: any) => {
  window.localStorage.removeItem(key);
  return;
};

export { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem };
