import { useEffect, useState } from 'react'
import { generateDatesFromYearBeginnin } from '../utils/generateDatesFromYearBeginnin'
import { HabitDay } from './HabitDay'
import { api } from '../lib/axios'
import dayjs from 'dayjs'

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const summaryDates = generateDatesFromYearBeginnin()
const minimusSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimusSummaryDatesSize - summaryDates.length

type Summary = {
  id: string
  date: string
  amount: number
  completed: number
}[]

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api
      .get('summary')
      .then(response => setSummary(response.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3 p-1">
        {weekdays.map((weekday, index) => (
          <div
            key={weekday + index}
            className="text-zinc-400 text-xl h-10 font-bold flex items-center justify-center"
          >
            {weekday}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map(date => {
            const dayInSummary = summary.find(day =>
              dayjs(date).isSame(day.date, 'day')
            )
            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            )
          })}
        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => (
            <div
              key={index}
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
            ></div>
          ))}
      </div>
    </div>
  )
}
