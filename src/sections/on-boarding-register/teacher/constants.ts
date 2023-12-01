import { SxProps } from "@mui/system";

export const WELCOM_STEP_WRAPPER_SX = {
  ml: { xs: 3, sm: 3, md: 0 },
  mt: "10px",
  justifyContent: { xs: "center", md: "start" },
};

export const WELCOM_STEP_SUBTITLE_SX = {
  pb: 3,
  ml: { xs: 3, sm: 3, md: 0 },
  textAlign: { xs: "center", md: "left" },
};

export const POPUP_SESION_BTN_SX = {
  py: 2,
  mb: 1,
  borderRadius: "15px",
  width: "100%",
};

export const LAUNCH_SESSION_BTN_SX = {
  color: "inherit",
  py: 2,
  borderRadius: "15px",
  width: "100%",
};

export const getImageWrapperSx = (color: string): SxProps => ({
  display: { xs: "none", sm: "flex" },
  background: color,
  borderRadius: "15px",
  mr: 1,
  p: 1.5,
  alignItems: "center",
  justifyContent: "center",
  minWidth: "100px",
  width: "100px",
  height: "100px",
});
