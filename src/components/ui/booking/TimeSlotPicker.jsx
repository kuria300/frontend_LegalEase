import { Clock } from "lucide-react";
import { formatTime } from "../../../utils/formatTime";

const TimeSlotPicker = ({ slots, selectedTime, onTimeSelect, loading }) => {

  // display skeleton placeholders while slots are being fetched from backend
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-11 rounded-lg bg-surface-container animate-pulse"
          />
        ))}
      </div>
    );
  }

  // handle empty state - when the backend returns no slots for the selected date
  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Clock size={20} className="text-outline-variant" />
        <p className="text-sm text-outline">
          No available slots for this date. Please select another date.
        </p>
      </div>
    );
  }

  return (
    // max-h + overflow-y-auto so the 18-slot grid scrolls within the modal
    // without pushing the meeting type and button off screen
    <div className="max-h-56 overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          const isUnavailable = !slot.available;

          return (
            <button
              // prevent click on booked slots
              key={slot.time}
              onClick={() => !isUnavailable && onTimeSelect(slot.time)}
              disabled={isUnavailable}
              className={`timeslot-btn ${
                isSelected
                  ? "timeslot-selected"
                  : isUnavailable
                  ? "timeslot-unavailable"
                  : "timeslot-default"
              }`}
            >
              {/* display time in 12 hrs format for readability */}
              {formatTime(slot.time)}
              {isUnavailable && (
                <span className="block text-[10px] text-outline leading-none mt-0.5">
                  Booked
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;