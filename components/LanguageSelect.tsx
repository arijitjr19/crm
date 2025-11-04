import {
    Box,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    FormHelperText,
    SelectChangeEvent,
  } from "@mui/material";
  import React from "react";
  
  interface LanguageOption {
    language: string;
    code: string;
  }
  
  interface LanguageSelectProps {
    value: string[]; // 👈 explicitly tell TS this is an array of strings
    onChange: (value: string[]) => void; // 👈 also explicit
    invalid?: boolean;
    error?: { message?: string };
    language_list: { getData: () => LanguageOption[] };
  }
  
  export default function LanguageSelect({
    value = [],
    onChange,
    invalid,
    error,
    language_list,
  }: LanguageSelectProps) {
    const handleChange = (event: SelectChangeEvent<string[]>) => {
      const selected = event.target.value as string[];
      onChange(selected);
    };
  
    return (
      <Box>
        <Select<string[]>
          multiple
          fullWidth
          size="small"
          displayEmpty
          value={value}
          onChange={handleChange}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <span style={{ color: "#888" }}>Select Languages</span>;
            }
            return selected.join(", ");
          }}
        >
          {language_list
            .getData()
            .map((_language: LanguageOption) => (
              <MenuItem key={_language.code} value={_language.language}>
                <Checkbox checked={value.includes(_language.language)} />
                <ListItemText primary={_language.language} />
              </MenuItem>
            ))}
        </Select>
  
        {invalid && (
          <FormHelperText sx={{ color: "#FF5630" }}>
            {error?.message}
          </FormHelperText>
        )}
      </Box>
    );
  }
  