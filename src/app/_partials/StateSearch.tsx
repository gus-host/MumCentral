"use client";

import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export type StateItem = {
  name: string;
  lat: number;
  lng: number;
  // optional: capital?: string
};

type Props = {
  onSelect?: (s: StateItem) => void; // called when a state is selected / searched
  placeholder?: string;
  initialValue?: string;
  value?: StateItem | null;
  valueValidate?: (found: StateItem | null) => void;
  inValidateValue?: () => void;
};

export const NIGERIA_STATES: StateItem[] = [
  { name: "Abia", lat: 5.532, lng: 7.486 },
  { name: "Adamawa", lat: 9.3265, lng: 12.3984 },
  { name: "Akwa Ibom", lat: 4.875, lng: 7.947 },
  { name: "Anambra", lat: 6.2104, lng: 7.0699 },
  { name: "Bauchi", lat: 10.3108, lng: 9.8446 },
  { name: "Bayelsa", lat: 4.927, lng: 6.2647 },
  { name: "Benue", lat: 7.1904, lng: 8.1299 },
  { name: "Borno", lat: 11.8333, lng: 13.15 },
  { name: "Cross River", lat: 5.9667, lng: 8.3333 },
  { name: "Delta", lat: 5.704, lng: 5.9339 },
  { name: "Ebonyi", lat: 6.2786, lng: 8.1113 },
  { name: "Edo", lat: 6.3388, lng: 5.6037 },
  { name: "Ekiti", lat: 7.6239, lng: 5.22 },
  { name: "Enugu", lat: 6.45, lng: 7.5 },
  { name: "FCT - Abuja", lat: 9.0765, lng: 7.3986 },
  { name: "Gombe", lat: 10.2897, lng: 11.1719 },
  { name: "Imo", lat: 5.4803, lng: 7.0258 },
  { name: "Jigawa", lat: 12.1542, lng: 10.8025 },
  { name: "Kaduna", lat: 10.51, lng: 7.4167 },
  { name: "Kano", lat: 11.9964, lng: 8.5222 },
  { name: "Katsina", lat: 12.9906, lng: 7.6 },
  { name: "Kebbi", lat: 12.45, lng: 4.1995 },
  { name: "Kogi", lat: 7.7333, lng: 6.7333 },
  { name: "Kwara", lat: 8.5, lng: 4.55 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Nasarawa", lat: 8.5, lng: 8.5167 },
  { name: "Niger", lat: 8.985, lng: 6.2 },
  { name: "Ogun", lat: 7.1604, lng: 3.345 },
  { name: "Ondo", lat: 7.25, lng: 5.2 },
  { name: "Osun", lat: 7.7667, lng: 4.55 },
  { name: "Oyo", lat: 7.8333, lng: 3.9167 },
  { name: "Plateau", lat: 9.17, lng: 9.6 },
  { name: "Rivers", lat: 4.8106, lng: 7.0498 },
  { name: "Sokoto", lat: 13.0059, lng: 5.2478 },
  { name: "Taraba", lat: 8.892, lng: 11.3614 },
  { name: "Yobe", lat: 11.7486, lng: 11.9669 },
  { name: "Zamfara", lat: 12.1582, lng: 6.7721 },
];

export default function StateSearch({
  onSelect,
  placeholder = "Search state (e.g. Enugu)",
  initialValue,
  value,
  valueValidate,
  inValidateValue,
}: Props) {
  const [inputValue, setInputValue] = useState(initialValue ?? "");

  // Called when user clicks Search button (or you could use onChange of Autocomplete)
  function handleSearchClick() {
    const q = inputValue.trim().toLowerCase();
    if (!q) return;

    // try to find an exact/state-contains match
    const found =
      NIGERIA_STATES.find((s) => s.name.toLowerCase() === q) ??
      NIGERIA_STATES.find((s) => s.name.toLowerCase().includes(q)) ??
      null;

    if (found) {
      valueValidate?.(found);
      onSelect?.(found);
    } else {
      // Not found — you can show a message or keep as free text
      // For now just clear selection and do nothing
      inValidateValue?.();
      // optionally: show toast "State not found"
      console.warn("State not found:", inputValue);
    }
  }

  return (
    <Box display="flex" gap={1} alignItems="center">
      <Autocomplete
        options={NIGERIA_STATES}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(_, newVal) => {
          valueValidate?.(newVal);
          if (newVal) {
            setInputValue(newVal.name);
            onSelect?.(newVal);
          }
        }}
        inputValue={inputValue}
        onInputChange={(_, newInput) => setInputValue(newInput)}
        sx={{ minWidth: 300 }}
        openOnFocus
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSearchClick}
                    edge="end"
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Button
        variant="contained"
        onClick={handleSearchClick}
        className="max-[480px]:hidden!"
      >
        Search
      </Button>
    </Box>
  );
}
