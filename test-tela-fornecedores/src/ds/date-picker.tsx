/**
 * DatePicker — InfoPrice DS
 *
 * Calendario inline com selecao de data unica ou range.
 * Header com nav prev/next, weekdays Dom-Sab, grid 6x7.
 * Estados: today, selected, other-month, range-start/end/in-range, disabled.
 *
 * Markup canonico: design-system/components/basic/date-picker/date-picker.html
 *
 * Sem libs externas — usa Date built-in.
 *
 * Uso:
 *
 *   // Single
 *   const [date, setDate] = useState<Date | null>(null);
 *   <DatePicker value={date} onChange={setDate} />
 *
 *   // Range
 *   const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
 *   <DatePicker mode="range" value={range} onChange={setRange} />
 */

import { useMemo, useState } from 'react';
import clsx from 'clsx';

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAYS_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// ─── Helpers de data (sem libs) ──────────────────────────────────

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function isInRange(d: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = startOfDay(d).getTime();
  const s = startOfDay(start).getTime();
  const e = startOfDay(end).getTime();
  return t > s && t < e;
}

/** Retorna grid de 42 dias (6 semanas x 7 dias) cobrindo o mes alvo */
function buildCalendarGrid(year: number, month: number): Array<{ date: Date; otherMonth: boolean }> {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0=Sun
  const gridStart = new Date(year, month, 1 - startWeekday);
  const grid: Array<{ date: Date; otherMonth: boolean }> = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    grid.push({ date: d, otherMonth: d.getMonth() !== month });
  }
  return grid;
}

// ─── Tipos ───────────────────────────────────────────────────────

export type DateRange = [Date | null, Date | null];

export type DatePickerSingleProps = {
  mode?: 'single';
  value: Date | null;
  onChange: (value: Date | null) => void;
};

export type DatePickerRangeProps = {
  mode: 'range';
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export type DatePickerCommonProps = {
  /** Mes/ano inicial exibido. Default: hoje (ou primeiro valor selecionado) */
  defaultMonth?: Date;
  /** Funcao que retorna true para datas desabilitadas */
  isDisabled?: (date: Date) => boolean;
  /** Data minima selecionavel (inclusive) */
  minDate?: Date;
  /** Data maxima selecionavel (inclusive) */
  maxDate?: Date;
  className?: string;
  /** Locale do nome do mes; default 'pt' */
  monthNames?: string[];
  /** Iniciais dos dias da semana (7 itens, Dom...Sab); default ['D','S','T','Q','Q','S','S'] */
  weekdayLabels?: [string, string, string, string, string, string, string];
};

export type DatePickerProps = DatePickerCommonProps & (DatePickerSingleProps | DatePickerRangeProps);

// ─── Componente ──────────────────────────────────────────────────

export default function DatePicker(props: DatePickerProps) {
  const {
    defaultMonth,
    isDisabled,
    minDate,
    maxDate,
    className,
    monthNames = MONTHS_PT,
    weekdayLabels = WEEKDAYS_PT as [string, string, string, string, string, string, string],
  } = props;

  // Mes/ano em exibicao (controlado internamente)
  const initialMonth = useMemo(() => {
    if (defaultMonth) return defaultMonth;
    if (props.mode === 'range') {
      return props.value[0] ?? new Date();
    }
    return props.value ?? new Date();
  }, []); // calcula 1x

  const [viewYear, setViewYear] = useState(initialMonth.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialMonth.getMonth());

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const today = useMemo(() => startOfDay(new Date()), []);

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const dayDisabled = (d: Date): boolean => {
    if (minDate && isBefore(d, minDate)) return true;
    if (maxDate && isAfter(d, maxDate)) return true;
    if (isDisabled?.(d)) return true;
    return false;
  };

  const handleDayClick = (d: Date) => {
    if (dayDisabled(d)) return;
    const day = startOfDay(d);
    if (props.mode === 'range') {
      const [start, end] = props.value;
      if (!start || (start && end)) {
        // Comeca novo range
        props.onChange([day, null]);
      } else if (start && !end) {
        if (isBefore(day, start)) {
          // Inverte se selecionado antes do start
          props.onChange([day, start]);
        } else if (isSameDay(day, start)) {
          // Click no mesmo dia limpa
          props.onChange([null, null]);
        } else {
          props.onChange([start, day]);
        }
      }
    } else {
      props.onChange(isSameDay(props.value, day) ? null : day);
    }
  };

  const isSelected = (d: Date): boolean => {
    if (props.mode === 'range') {
      const [s, e] = props.value;
      return isSameDay(d, s) || isSameDay(d, e);
    }
    return isSameDay(d, props.value);
  };

  const isRangeStart = (d: Date): boolean => {
    if (props.mode !== 'range') return false;
    return isSameDay(d, props.value[0]);
  };

  const isRangeEnd = (d: Date): boolean => {
    if (props.mode !== 'range') return false;
    return isSameDay(d, props.value[1]);
  };

  const isDayInRange = (d: Date): boolean => {
    if (props.mode !== 'range') return false;
    return isInRange(d, props.value[0], props.value[1]);
  };

  return (
    <div className={clsx('date-picker', className)}>
      <div className="date-picker__header">
        <button
          type="button"
          className="date-picker__nav"
          aria-label="Mês anterior"
          onClick={goPrev}
        >
          <span className="material-icons-outlined">chevron_left</span>
        </button>
        <span className="date-picker__title">{monthNames[viewMonth]} {viewYear}</span>
        <button
          type="button"
          className="date-picker__nav"
          aria-label="Próximo mês"
          onClick={goNext}
        >
          <span className="material-icons-outlined">chevron_right</span>
        </button>
      </div>

      <div className="date-picker__weekdays">
        {weekdayLabels.map((wd, i) => (
          <span key={i} className="date-picker__weekday">{wd}</span>
        ))}
      </div>

      <div className="date-picker__days">
        {grid.map(({ date, otherMonth }, idx) => {
          const disabled = dayDisabled(date);
          const selected = isSelected(date);
          const inRange = isDayInRange(date);
          const isToday = isSameDay(date, today);
          return (
            <button
              key={idx}
              type="button"
              className={clsx(
                'date-picker__day',
                otherMonth && 'date-picker__day--other-month',
                isToday && 'date-picker__day--today',
                selected && 'date-picker__day--selected',
                inRange && 'date-picker__day--in-range',
                isRangeStart(date) && 'date-picker__day--range-start',
                isRangeEnd(date) && 'date-picker__day--range-end',
                disabled && 'date-picker__day--disabled'
              )}
              disabled={disabled}
              aria-label={date.toLocaleDateString('pt-BR')}
              aria-pressed={selected || undefined}
              onClick={() => handleDayClick(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
