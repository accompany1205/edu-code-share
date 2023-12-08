import { type FC, useState, useEffect, useRef, KeyboardEvent } from "react";

import { Button, TextField, CircularProgress } from "@mui/material";

import ConfirmModalWrapper from "../confirm-wrapper-modal";
import { File } from "src/components/code-editor-collab/hook/utils/collab/requests";

import { validate } from "./validator"
import { styles } from "./styles"

interface FileFormProps {
  isOpen: boolean
  onClose: () => void
  defaultValue?: string
  onSubmit: (fileName: string) => Promise<void>
  fileList: File[]
  isMultipleExtensionFiles: boolean
}

const ENTER_KEY = "Enter";

const FileForm: FC<FileFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValue,
  fileList,
  isMultipleExtensionFiles
}) => {
  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  const _onClose = () => {
    onClose();
    setValue("");
    setError(null);
  }

  const onAdd = async () => {
    if (isLoading) {
      return;
    }

    const error = validate({
      fileName: value,
      fileList,
      isMultipleExtensionFiles
    });
    
    setError(error);

    if (error != null) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(value);
    } finally {
      setIsLoading(false);
    }
    
    _onClose();
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ENTER_KEY) {
      onAdd();
    }
  }

  useEffect(() => {
    if (isOpen) {
      textFieldRef.current?.querySelector('input')?.focus();
    }
  }, [isOpen]);

  return (
    <ConfirmModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add file"
    >
      <TextField
        ref={textFieldRef}
        variant="outlined"
        error={error != null}
        label="File name"
        sx={styles.INPUT}
        value={value}
        onKeyDown={onKeyDown}
        onChange={({ target: { value } }) => setValue(value)}
        helperText={error != null ? error : ""}
      />

      <Button
        onClick={onAdd}
        sx={styles.ADD_BUTTON}
        variant="contained"
      >
        {isLoading ? <CircularProgress size={20} /> : "Add file"}
      </Button>
    </ConfirmModalWrapper>
  )
}

export default FileForm;
