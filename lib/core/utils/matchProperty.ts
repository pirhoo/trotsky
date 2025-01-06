/**
 * Creates a function that matches a specific property of an object to a given value.
 *
 * @param name - The property name to match.
 * @param value - The value to compare against the object's property.
 * @returns A function that takes an object and returns `true` if the object's property matches the given value, otherwise `false`.
 */
export default function matchProperty (name: string, value: unknown) {
  return (d: Record<string, unknown>) => d[name] === value
}
