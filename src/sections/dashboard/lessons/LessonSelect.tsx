import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { LessonContentType } from "src/redux/services/enums/lesson-content-type.enum";
import { useTranslate } from "src/utils/translateHelper";

interface Props {
  setOptions: (event: string) => void;
  contentType: string;
}

export default function LessonSelect({
  setOptions,
  contentType,
}: Props): React.ReactElement {
  const handleChange = (event: SelectChangeEvent): void => {
    setOptions(event.target.value);
  };
  const translate = useTranslate();

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 150, margin: "10px" }} size="small">
        <InputLabel id="lesson-select">{translate("type")}</InputLabel>
        <Select
          sx={{ p: 0.3 }}
          labelId="lesson-select"
          id="select-small"
          value={contentType}
          label={translate("type")}
          onChange={handleChange}
        >
          {Object.keys(LessonContentType).map((el) => (
            <MenuItem
              key={LessonContentType[el as keyof typeof LessonContentType]}
              value={LessonContentType[el as keyof typeof LessonContentType]}
            >
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
