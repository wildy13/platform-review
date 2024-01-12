export const useFilter = (items, key, fields) => items.filter(
  (obj) => {
    const arr = fields.reduce((p, c) => [...p, obj[c]], []);
    return arr.some((val) => val.toLowerCase().includes(key.toLowerCase()));
  },
);
