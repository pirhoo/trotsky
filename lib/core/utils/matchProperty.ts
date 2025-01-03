export default function matchProperty(name: string, value: unknown) {
  return (d: object) => d[name] === value
}