import { useState } from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

export default function LeaveTracker() {
  const [usedDates, setUsedDates] = useState([])
  const [dateInput, setDateInput] = useState("")
  const [subDates, setSubDates] = useState([
    "2025-05-05", "2025-05-06", "2025-06-06", "2025-06-09"
  ])
  const [subInput, setSubInput] = useState("")

  const initialAnnual = 4
  const initialSick = 3
  const monthlyIncrease = 1

  const getMonthDiff = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  }

  const calculateLeave = () => {
    const today = new Date("2025-07-03")
    const baseDate = new Date("2025-05-06")
    const monthsPassed = getMonthDiff(baseDate, today)

    let totalAnnual = initialAnnual + monthsPassed * monthlyIncrease
    let totalSick = initialSick + monthsPassed * monthlyIncrease
    let totalSub = subDates.length

    let subUsed = 0
    let annualUsed = 0

    usedDates.forEach(date => {
      if (subUsed < totalSub) subUsed++
      else annualUsed++
    })

    return {
      remainingAnnual: totalAnnual - annualUsed,
      remainingSick: totalSick,
      remainingSub: totalSub - subUsed
    }
  }

  const addDate = () => {
    if (dateInput && !usedDates.includes(dateInput)) {
      setUsedDates([...usedDates, dateInput])
      setDateInput("")
    }
  }

  const deleteDate = (target) => {
    setUsedDates(usedDates.filter(date => date !== target))
  }

  const addSubDate = () => {
    if (subInput && !subDates.includes(subInput)) {
      setSubDates([...subDates, subInput])
      setSubInput("")
    }
  }

  const { remainingAnnual, remainingSick, remainingSub } = calculateLeave()

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>연차/병가 계산기</h1>

      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          <button onClick={addDate}>휴가 사용일 추가</button>
        </div>
        <div>
          <strong>사용한 날짜:</strong>
          <ul>
            {usedDates.map((date, idx) => (
              <li key={idx}>{date} <button onClick={() => deleteDate(date)}>❌</button></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input type="date" value={subInput} onChange={(e) => setSubInput(e.target.value)} />
          <button onClick={addSubDate}>대체휴가 추가</button>
        </div>
        <div>
          <strong>대체휴가 날짜:</strong>
          <ul>
            {subDates.map((date, idx) => (
              <li key={idx}>{date}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
        <p>🟢 남은 연차: <strong>{remainingAnnual}일</strong></p>
        <p>🟡 남은 대체휴가: <strong>{remainingSub}일</strong></p>
        <p>🔵 남은 병가: <strong>{remainingSick}일</strong></p>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "8px" }}>📅 달력 (참고용)</h2>
        <Calendar
          value={new Date("2025-08-01")}
          tileClassName={({ date }) => {
            const iso = date.toISOString().split("T")[0]
            if (usedDates.includes(iso)) return "bg-blue-200"
            if (subDates.includes(iso)) return "bg-yellow-200"
            return null
          }}
        />
      </div>
    </div>
  )
}
