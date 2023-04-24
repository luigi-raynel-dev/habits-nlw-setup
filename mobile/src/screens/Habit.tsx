import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import BackButton from '../components/BackButton'
import dayjs from 'dayjs'
import ProgressBar from '../components/ProgressBar'
import Checkbox from '../components/Checkbox'
import { api } from '../lib/axios'
import Loading from '../components/Loading'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import HabitsEmpty from '../components/HabitsEmpty'
import clsx from 'clsx'

export interface HabitParams {
  date: string
}

export interface DayInfoProps {
  completedHabits: string[]
  possibleHabits: {
    id: string
    title: string
    createdAt: string
  }[]
}

export function Habit() {
  const [isLoading, setIsLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)

  const route = useRoute()
  const { date } = route.params as HabitParams

  const parsedDate = dayjs(date)
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        dayInfo.completedHabits.length
      )
    : 0

  const getHabits = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/day`, { params: { date } })
      setDayInfo(response.data)
    } catch (error) {
      Alert.alert('Ops!', 'Não foi possível carregar as informações do hábito.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getHabits()
  }, [])

  const handleToggleHabit = async (habitId: string) => {
    try {
      await api.patch(`/habits/${habitId}/toggle`)

      const isHabitAlreadyCompleted = dayInfo?.completedHabits.includes(habitId)

      let completedHabits: string[] = []

      completedHabits = isHabitAlreadyCompleted
        ? dayInfo!.completedHabits.filter(id => id !== habitId)
        : [...dayInfo!.completedHabits, habitId]

      setDayInfo({
        possibleHabits: dayInfo!.possibleHabits,
        completedHabits
      })
    } catch (error) {
      Alert.alert('Ops!', 'Não foi possível atualizar o status hábito.')
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="mt-6 text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx('mt-6', {
            ['opacity-20']: isDateInPast
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map(habit => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={dayInfo.completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar um hábito de uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}
