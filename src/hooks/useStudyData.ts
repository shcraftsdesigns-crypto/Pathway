import { useCallback, useEffect, useState } from 'react'
import {
  getStudyData,
  type StudyData,
} from '@/lib/studyStorage'

export function useStudyData() {
  const [data, setData] = useState<StudyData>(
    () => getStudyData(),
  )

  const refresh = useCallback(() => {
    setData(getStudyData())
  }, [])

  useEffect(() => {
    const handleChange = () => refresh()

    window.addEventListener(
      'pathway-study-change',
      handleChange,
    )
    window.addEventListener('storage', handleChange)

    return () => {
      window.removeEventListener(
        'pathway-study-change',
        handleChange,
      )
      window.removeEventListener('storage', handleChange)
    }
  }, [refresh])

  return {
    data,
    refresh,
  }
}
