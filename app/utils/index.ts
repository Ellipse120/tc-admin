export function formatText<T extends Record<string, string>>(
  list: T[],
  value: string,
  keyAlias = 'value',
  valueAlias = 'label'
) {
  if (['', undefined, 'undefined', null, 'null'].includes(value)) {
    return ''
  }
  if (list === null || !Array.isArray(list)) {
    return ''
  }
  const target = list.find(item => item[keyAlias] === value)
  return target ? target[valueAlias] : value
}
