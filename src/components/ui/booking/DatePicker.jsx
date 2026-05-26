import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DatePicker = ({ selectedDate, onDateSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // track month/year the calendar is currently showing
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // navigate to previous month
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  // navigate to the next month
  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // create the 7 column calendar grid
  const buildCalendarDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    //fill the leading cells with trailing days of the previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, currentMonth: false });
    }

    // fill current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, currentMonth: true });
    }

    //fill traiing cells to complete the last row
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, currentMonth: false });
      }
    }

    return cells;
  };

  // check if day cell matches today's date
  const isToday = (day) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  // check if a day cell matches the currently selected date
  const isSelected = (day) => {
    if (!selectedDate) return false;
    const sel = new Date(selectedDate);
    return (
      day === sel.getDate() &&
      viewMonth === sel.getMonth() &&
      viewYear === sel.getFullYear()
    );
  };

  // check if a day falls before today
  const isPast = (day) => {
    const cellDate = new Date(viewYear, viewMonth, day);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate < today;
  };

  // Block Saturday (6) and Sunday (0) bookings
  const isWeekend = (day) => {
    const date = new Date(viewYear, viewMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // only allow selection on current month weekdays that aren't in the past
  const handleDayClick = (day, currentMonth) => {
    if (!currentMonth) return;
    const clicked = new Date(viewYear, viewMonth, day);
    clicked.setHours(0, 0, 0, 0);
    if (clicked < today || isWeekend(day)) return;
    onDateSelect(clicked);
  };

  // prevent navigating back before the current month
  const isAtMinMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const cells = buildCalendarDays();

  return (
    <div className="w-full">

      {/* Month navigation*/}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPrevMonth}
          disabled={isAtMinMonth}
          className="datepicker-nav-btn"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} className="text-on-surface-variant" />
        </button>

        <span className="datepicker-month-label">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          onClick={goToNextMonth}
          className="datepicker-nav-btn"
          aria-label="Next month"
        >
          <ChevronRight size={16} className="text-on-surface-variant" />
        </button>
      </div>

      {/* Day headers*/}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className={`datepicker-day-header ${
              d === "Sa" || d === "Su" ? "opacity-40" : ""
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid with state driven styling per cell*/}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, idx) => {
          const past = cell.currentMonth && isPast(cell.day);
          const weekend = cell.currentMonth && isWeekend(cell.day);
          const selected = cell.currentMonth && isSelected(cell.day);
          const todayCell = cell.currentMonth && isToday(cell.day);
          const disabled = !cell.currentMonth || past || weekend;

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(cell.day, cell.currentMonth)}
              disabled={disabled}
              // describe week days to screen readers
              aria-label={
                weekend && cell.currentMonth
                  ? `${cell.day} — weekends unavailable`
                  : undefined
              }
              // apply single state class
              className={`datepicker-day-btn ${
                selected
                  ? "datepicker-day-selected"
                  : todayCell
                  ? "datepicker-day-today"
                  : weekend && cell.currentMonth
                  ? "datepicker-day-weekend"
                  : disabled
                  ? "datepicker-day-disabled"
                  : "datepicker-day-default"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      {/* Availability notice -> Weekends not bookable */}
      <p className="text-xs text-outline mt-3">
        Available Monday – Friday only.
      </p>
    </div>
  );
};

export default DatePicker;