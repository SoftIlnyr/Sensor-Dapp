export function compareByDateAsc(a, b) {
  return a.date.getTime() - b.date.getTime()
}

export function compareByDateDesc(a, b) {
  return b.date.getTime() - a.date.getTime()
}

export function compareByValueAsc(a, b) {
  return a.value - b.value
}

export function compareByValueDesc(a, b) {
  return b.value - a.value
}