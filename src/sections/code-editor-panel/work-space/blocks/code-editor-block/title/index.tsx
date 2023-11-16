import { type FC } from "react";

import Close from "@mui/icons-material/Close";
import { Stack, IconButton, Typography } from "@mui/material";

import { EditorMode } from "src/components/code-editor-collab/hook/constants";
import { type CodeEditorControllerRoom } from "src/redux/slices/code-editor-controller";

interface TitleProps {
  room: CodeEditorControllerRoom | null
  onResetRoom: () => void
}

const TITLE = "Code Editor";

const Title: FC<TitleProps> = ({
  room,
  onResetRoom
}) => {
  const isSimpleTitle = room == null ||
    room.mode === EditorMode.Owner ||
    room.mode == null;

  if (isSimpleTitle) {
    return <>{TITLE}</>;
  }

  return (
    <Stack
      direction="row"
      gap="12px"
      alignItems="center"
      justifyContent="space-between"
    >
      {TITLE} - 

      <Typography variant="body1">
        {room.cursorText}
      </Typography>

      <IconButton sx={BUTTON_SX} onClick={onResetRoom}>
        <Close />
      </IconButton>
    </Stack>
  )
}

const BUTTON_SX = {
  padding: 0
};

export default Title;
