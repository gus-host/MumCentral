"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { v4 as uuidv4 } from "uuid";

export type Reminder = {
  id: string;
  title: string;
  dateTime: string; // ISO string
  // optionally: facilityId?: string, notes?: string, repeat?: string, etc
};

type Props = {
  // optional callback when a reminder is created
  onCreate?: (reminder: Reminder) => void;
  // optional button text
  triggerText?: string;
};

export default function ReminderModal({
  onCreate,
  triggerText = "Create Reminder",
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const today = new Date();

  function resetForm() {
    setTitle("");
    setDate(null);
    setTime(null);
    setError(null);
  }

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
    resetForm();
  }

  // Merge date and time into a single Date instance (in local timezone)
  function combineDateTime(datePart: Date, timePart: Date): Date {
    const combined = new Date(datePart);
    combined.setHours(
      timePart.getHours(),
      timePart.getMinutes(),
      timePart.getSeconds() || 0,
      0
    );
    return combined;
  }

  function validateAndCreate() {
    setError(null);

    if (!title.trim()) {
      setError("Please enter a reminder name.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (!time) {
      setError("Please select a time.");
      return;
    }

    const selectedDateTime = combineDateTime(date, time);
    if (selectedDateTime.getTime() < new Date().getTime()) {
      setError(
        "Cannot create a reminder in the past. Please choose a future date/time."
      );
      return;
    }

    const reminder: Reminder = {
      id: uuidv4(),
      title: title.trim(),
      dateTime: selectedDateTime.toISOString(),
    };

    // callback to parent
    onCreate?.(reminder);

    // simple feedback
    setSnackOpen(true);

    // close modal after a short delay to show snack
    setTimeout(() => {
      handleClose();
    }, 300);
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        {triggerText}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Create Reminder</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newVal) => setDate(newVal)}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // any other TextField props, e.g. helperText, variant
                    variant: "outlined" as const,
                  },
                }}
              />

              <TimePicker
                label="Time"
                value={time}
                onChange={(newVal) => setTime(newVal)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined" as const,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Reminder name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              autoFocus
            />

            {error && <FormHelperText error>{error}</FormHelperText>}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={validateAndCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Reminder created
        </Alert>
      </Snackbar>
    </>
  );
}
