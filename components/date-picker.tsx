"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
};

const DatePicker = ({ id, name, defaultValue }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date(),
  );

  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
  };

  const formattedStringDate = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" id={id} asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="justify-between w-full"
        >
          {formattedStringDate || "Select date"}
          <input type="hidden" name={name} value={formattedStringDate} />
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
