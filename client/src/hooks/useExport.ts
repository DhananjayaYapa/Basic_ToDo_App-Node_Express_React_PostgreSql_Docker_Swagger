import { taskService } from '../services/task.service'
import type { TaskQuery } from '../utilities/models'

// ─── Export Hooks (trigger file downloads) ───────────────────────────────────

export const useExport = () => {
  const exportCSV = async (query?: TaskQuery) => {
    try {
      const csvData = await taskService.exportCSV(query)
      const blob = new Blob([csvData as string], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('CSV export failed:', err)
    }
  }

  const exportJSON = async (query?: TaskQuery) => {
    try {
      const jsonData = await taskService.exportJSON(query)
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('JSON export failed:', err)
    }
  }

  return { exportCSV, exportJSON }
}
