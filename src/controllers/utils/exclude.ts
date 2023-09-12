/**
 * Exclude keys from object
 * @param obj
 * @param keys
 * @returns
 */
const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
  // Use the Object.keys method to create an array of keys to exclude
  const keysToExclude = keys.map((key) => key.toString());

  // Use the Object.entries and Object.fromEntries methods for filtering
  const filteredEntries = Object.entries(obj as string).filter(([key]) => !keysToExclude.includes(key));

  // Convert the filtered entries back to an object using Object.fromEntries
  return Object.fromEntries(filteredEntries) as Omit<Type, Key>;
};

export default exclude;
