import {
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { Iconify } from "@components";
import { useTranslate } from "src/utils/translateHelper";

const INPUT_WIDTH = 160;

interface Props {
  filterName: string;
  isFiltered: boolean;
  filterType: string;
  optionsType: string[];
  filterEndDate: Date | null;
  onResetFilter: VoidFunction;
  filterStartDate: Date | null;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterService: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStartDate: (value: Date | null) => void;
  onFilterEndDate: (value: Date | null) => void;
}

export default function AssignmentsTableToolbar({
  filterName,
  isFiltered,
  onFilterName,
  filterEndDate,
  filterType,
  onResetFilter,
  optionsType,
  filterStartDate,
  onFilterService,
  onFilterEndDate,
  onFilterStartDate,
}: Props) {
  const translate = useTranslate();

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: "column",
        md: "row",
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        select
        label={translate("type")}
        value={filterType}
        onChange={onFilterService}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { maxHeight: 220 },
            },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: "capitalize",
        }}
      >
        {optionsType.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: "body2",
              textTransform: "capitalize",
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label={translate("assignments_start_date")}
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label={translate("assignments_end_date")}
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder={translate("assignments_search")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          {translate("actions_clear")}
        </Button>
      )}
    </Stack>
  );
}
