// @mui
import { TableCell, TableRow } from "@mui/material";

import { useTranslate } from "src/utils/translateHelper";

//
import { EmptyContent } from "../empty-content";

// ----------------------------------------------------------------------

interface Props {
  isNotFound: boolean;
}

export function TableNoData({ isNotFound }: Props): React.ReactElement | null {
  const translate = useTranslate();

  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            title={translate("messages_no_data")}
            sx={{
              "& span.MuiBox-root": { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
