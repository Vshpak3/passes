export const months = [
  {
    name: "September 2022",
    date: "9-2022",
    days: 30,
    firstDayIndex: 3
  },
  {
    name: "October 2022",
    date: "10-2022",
    days: 31,
    firstDayIndex: 5
  },
  {
    name: "November 2022",
    date: "11-2022",
    days: 30,
    firstDayIndex: 1
  },
  {
    name: "December 2022",
    date: "12-2022",
    days: 31,
    firstDayIndex: 3
  },
  {
    name: "January 2023",
    date: "1-2023",
    days: 31,
    firstDayIndex: 6
  },
  {
    name: "February 2023",
    date: "2-2023",
    days: 28,
    firstDayIndex: 2
  },
  {
    name: "March 2023",
    date: "3-2023",
    days: 31,
    firstDayIndex: 2
  },
  {
    name: "April 2023",
    date: "4-2023",
    days: 30,
    firstDayIndex: 5
  },
  {
    name: "May 2023",
    date: "5-2023",
    days: 31,
    firstDayIndex: 0
  },

  {
    name: "June 2023",
    date: "6-2023",
    days: 30,
    firstDayIndex: 3
  },

  {
    name: "July 2023",
    date: "7-2023",
    days: 31,
    firstDayIndex: 5
  },
  {
    name: "August 2023",
    date: "8-2023",
    days: 31,
    firstDayIndex: 1
  },
  {
    name: "September 2023",
    date: "9-2023",
    days: 30,
    firstDayIndex: 4
  },
  {
    name: "October 2023",
    date: "10-2023",
    days: 31,
    firstDayIndex: 6
  },
  {
    name: "November 2023",
    date: "11-2023",
    days: 30,
    firstDayIndex: 2
  },
  {
    name: "December 2023",
    date: "12-2023",
    days: 31,
    firstDayIndex: 4
  },
  {
    name: "January 2024",
    date: "1-2024",
    days: 31,
    firstDayIndex: 0
  },
  {
    name: "February 2024",
    date: "2-2024",
    days: 28,
    firstDayIndex: 3
  },
  {
    name: "March 2024",
    date: "3-2024",
    days: 31,
    firstDayIndex: 4
  },
  {
    name: "April 2024",
    date: "4-2024",
    days: 30,
    firstDayIndex: 0
  },
  {
    name: "May 2024",
    date: "5-2024",
    days: 31,
    firstDayIndex: 2
  },

  {
    name: "June 2024",
    date: "6-2024",
    days: 30,
    firstDayIndex: 5
  },

  {
    name: "July 2024",
    date: "7-2024",
    days: 31,
    firstDayIndex: 0
  },
  {
    name: "August 2024",
    date: "8-2024",
    days: 31,
    firstDayIndex: 3
  },
  {
    name: "September 2024",
    date: "9-2024",
    days: 30,
    firstDayIndex: 6
  },
  {
    name: "October 2024",
    date: "10-2024",
    days: 31,
    firstDayIndex: 1
  },
  {
    name: "November 2024",
    date: "11-2024",
    days: 30,
    firstDayIndex: 4
  },
  {
    name: "December 2024",
    date: "12-2024",
    days: 31,
    firstDayIndex: 6
  },
  {
    name: "January 2025",
    date: "1-2025",
    days: 31,
    firstDayIndex: 2
  },
  {
    name: "February 2025",
    date: "2-2025",
    days: 28,
    firstDayIndex: 5
  },
  {
    name: "March 2025",
    date: "3-2025",
    days: 31,
    firstDayIndex: 5
  },
  {
    name: "April 2025",
    date: "4-2025",
    days: 30,
    firstDayIndex: 1
  },
  {
    name: "May 2025",
    date: "5-2025",
    days: 31,
    firstDayIndex: 3
  },

  {
    name: "June 2025",
    date: "6-2025",
    days: 30,
    firstDayIndex: 6
  },

  {
    name: "July 2025",
    date: "7-2025",
    days: 31,
    firstDayIndex: 1
  },
  {
    name: "August 2025",
    date: "8-2025",
    days: 31,
    firstDayIndex: 4
  },
  {
    name: "September 2025",
    date: "9-2025",
    days: 30,
    firstDayIndex: 0
  },
  {
    name: "October 2025",
    date: "10-2025",
    days: 31,
    firstDayIndex: 2
  },
  {
    name: "November 2025",
    date: "11-2025",
    days: 30,
    firstDayIndex: 5
  },
  {
    name: "December 2025",
    date: "12-2025",
    days: 31,
    firstDayIndex: 0
  }
]

export const getCurrentDate = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const result = months.filter(
    (item) => item.date === `${currentMonth}-${currentYear}`
  )

  return result[0]
}
