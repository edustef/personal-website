"use client";

import {
  addDays,
  addMonths,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  className?: string;
  isDateDisabled?: (date: Date) => boolean;
  onMonthChange?: (month: Date) => void;
}

function getMonthDays(date: Date) {
  const start = startOfMonth(date);
  const startDay = getDay(start);
  const offset = startDay === 0 ? 6 : startDay - 1;

  const days: (Date | null)[] = [];

  for (let i = 0; i < offset; i++) {
    days.push(null);
  }

  let current = start;
  while (isSameMonth(current, date)) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

export function WeeklyCalendar({
  selected,
  onSelect,
  className,
  isDateDisabled,
  onMonthChange,
}: WeeklyCalendarProps) {
  const t = useTranslations("booking.calendar");
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [direction, setDirection] = React.useState(0);

  const days = React.useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  const weekdays = [
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
    t("sunday"),
  ];

  React.useEffect(() => {
    onMonthChange?.(currentMonth);
  }, [currentMonth, onMonthChange]);

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -50 || info.velocity.x < -300) {
      nextMonth();
    } else if (info.offset.x > 50 || info.velocity.x > 300) {
      prevMonth();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-base text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-[10px] font-medium text-muted-foreground uppercase py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="relative" style={{ minHeight: 260 }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="grid grid-cols-7 gap-1.5"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {days.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isSelected = selected ? isSameDay(date, selected) : false;
              const isToday = isSameDay(date, new Date());
              const isPast = isBefore(date, startOfDay(new Date()));
              const isDisabled = isDateDisabled ? isDateDisabled(date) : false;
              const isUnavailable = isPast || isDisabled;

              return (
                <motion.button
                  type="button"
                  key={date.toISOString()}
                  disabled={isUnavailable}
                  onClick={() => onSelect(date)}
                  data-selected={isSelected || undefined}
                  whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                  whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all relative border border-transparent",
                    isSelected &&
                      "bg-primary text-primary-foreground font-semibold border-primary",
                    !isSelected &&
                      !isUnavailable &&
                      "bg-muted/50 hover:bg-accent hover:border-border border-border/50",
                    isUnavailable &&
                      "opacity-30 cursor-not-allowed bg-transparent border-transparent",
                    isToday &&
                      !isSelected &&
                      !isUnavailable &&
                      "ring-2 ring-primary/50 font-semibold"
                  )}
                >
                  {format(date, "d")}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
