// @mui
import { Checkbox, Stack, StackProps, Typography } from "@mui/material";

import { useTranslate } from "src/utils/translateHelper";

// ----------------------------------------------------------------------

interface Props extends StackProps {
  dense?: boolean;
  action?: React.ReactNode;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: (checked: boolean) => void;
}

export function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  ...other
}: Props): React.ReactElement | null {
  if (!numSelected) {
    return null;
  }

  const translate = useTranslate();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 58,
        position: "absolute",
        bgcolor: "primary.lighter",
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onSelectAllRows(event.target.checked);
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: "primary.main",
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} {translate("selected")}
      </Typography>

      {action && action}
    </Stack>
  );
}
