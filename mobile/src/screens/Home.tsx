import React, { useCallback, useState } from 'react'
import { ScrollView, Text, View, Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { HabitDay, DAY_SIZE } from '../components/HabitDay'
import Header from '../components/Header'
import { generateDatesFromYearBeginnin } from '../utils/generateDatesFromYearBeginnin'
import { api } from '../lib/axios'
import Loading from '../components/Loading'
import dayjs from 'dayjs'

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const summaryDates = generateDatesFromYearBeginnin()
const minimusSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimusSummaryDatesSize - summaryDates.length

type SummaryProps = Array<{
  id: string
  date: string
  amount: number
  completed: number
}>

export function Home() {
  const { navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryProps | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('summary')
      setSummary(response.data)
    } catch (error) {
      Alert.alert('Ops! Não foi possível carregar o sumário de hábitos.')
      console.log(error)
    } finally {
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  return isLoading ? (
    <Loading />
  ) : (
    <View className="flex-1 bg-dark px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekdays.map((weekday, index) => (
          <Text
            key={weekday + index}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          ></Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {summaryDates.map(date => {
              const dayWithHabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() =>
                    navigate('habit', { date: date.toISOString() })
                  }
                />
              )
            })}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 border-zinc-800 m-1 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
