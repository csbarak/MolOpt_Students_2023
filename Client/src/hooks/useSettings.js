import { useContext } from 'react'
import { SettingsContext } from 'src/context/settingsContext'

export const useSettings = () => useContext(SettingsContext)
