export function getStartEnd(month: number, year: number) {
  const startMonths = year * 12 + month - 1
  const startDate = new Date(0)
  startDate.setMonth(startMonths % 12)
  startDate.setFullYear(Math.floor(startMonths / 12))
  const endDate = new Date(0)
  endDate.setMonth(month)
  endDate.setFullYear(year)
  return [startDate, endDate]
}
