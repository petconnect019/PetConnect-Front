import React, { useState, useEffect, useRef } from 'react';
import CalendarIcon from '../../assets/Calendar.png';

export const CalendarInput = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYears, setShowYears] = useState(false);
 
  const calendarRef = useRef(null);

  useEffect(() => {
    updateCalendar(month, year);
  }, [month, year]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if ( calendarRef.current && !calendarRef.current.contains(event.target) && !event.target.closest('.calendar-input')) {
        setShowCalendar(false);
        setShowYears(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const updateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const days = new Array(firstDay).fill(null).concat([...Array(lastDay).keys()].map(i => i + 1));
    setDaysInMonth(days);
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else if (direction === 'next') {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const formattedDate = `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
    setSelectedDate(new Date(year, month, day));
    onDateSelect(formattedDate);
    setShowCalendar(false);
  };

  const getMonthName = (month) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
  };

  const selectYear = (selectedYear) => {
    setYear(selectedYear);
    setShowYears(true);
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* Input para seleccionar la fecha */}
      <div 
        className="flex items-center bg-gray-100 rounded p-2 cursor-pointer" 
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <img src={CalendarIcon} alt="Calendar" className="w-6 h-6 ml-2" />
        <input 
          type="text" 
          value={selectedDate ? `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear().toString()}` : ''}
          readOnly 
          className="bg-transparent cursor-pointer outline-none w-full pl-4"
          placeholder="Fecha de Nacimiento"
        />
      </div>
      
      {showCalendar && (
        <div className="absolute bg-white rounded shadow-lg mt-2 z-50">
          <header className="flex items-center justify-between p-4">
            <p className="text-xl font-medium">
              {getMonthName(month)}  
              <span 
                className="ml-2 cursor-pointer text-orange-500 hover:underline" 
                onClick={() => setShowYears(!showYears)}
              >
                {year}
              </span>
            </p>
            <div className="flex">
              <span 
                className="flex items-center justify-center h-10 w-10 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer text-2xl"
                onClick={() => changeMonth('prev')}
              >
                &#8249;
              </span>
              <span 
                className="flex items-center justify-center h-10 w-10 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer text-2xl ml-2"
                onClick={() => changeMonth('next')}
              >
                &#8250;
              </span>
            </div>
          </header>

          {showYears ? (
            <div className="p-4 max-h-48 overflow-y-auto">
              {[...Array(20)].map((_, index) => {
                const yearOption = new Date().getFullYear() -  index; 
                return (
                  <p 
                    key={yearOption} 
                    className={`text-center p-2 cursor-pointer rounded
                      ${yearOption === year ? 'bg-brand text-white font-bold' : 'hover:bg-gray-200'}`}
                    onClick={() => selectYear(yearOption)}
                  >
                    {yearOption}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <ul className="grid grid-cols-7 gap-2 text-center mb-4">
                {["D", "L", "M", "M", "J", "V", "S"].map(day => (
                  <li key={day} className="font-semibold text-gray-600">{day}</li>
                ))}
              </ul>

              <ul className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day, index) => (
                  <li key={index} className="relative group">
                    <span 
                      className={`w-10 h-10 flex items-center justify-center text-lg font-medium cursor-pointer 
                        ${
                          selectedDate && 
                          selectedDate.getDate() === day && 
                          selectedDate.getMonth() === month && 
                          selectedDate.getFullYear() === year 
                          ? 'bg-brand text-white rounded-full' 
                          : 'text-gray-700'
                        } 
                        ${index < new Date(year, month, 1).getDay() ? 'invisible' : ''}`}
                      onClick={() => handleDateClick(day)}
                    >
                      {day}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
