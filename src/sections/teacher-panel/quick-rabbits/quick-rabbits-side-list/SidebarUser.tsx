import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  ListItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { io } from "socket.io-client";

import {
  IChatMessage,
  useFirebaseChat,
} from "@sections/teacher-panel/atoms/useFirebaseChat.hook";
import LoaderDelay from "@sections/teacher-panel/LoaderDelay";
import { isNull } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createRabit } from "src/redux/slices/rabits";
import { ActivityStatus } from "../../../../types/activity-status";
import { getActivityColor } from "../../../../utils/activity-color";
import { useSocket } from "@hooks";

const AvatarSkeleton = (): React.ReactElement => {
  return (
    <Skeleton
      variant="circular"
      animation="wave"
      sx={{
        width: { xs: 40, sm: 40, md: 50 },
        height: { xs: 40, sm: 40, md: 50 },
      }}
    />
  );
};

interface Props {
  status?: ActivityStatus;
  student: Record<string, any>;
  isLoading: boolean;
}

export const SidebarUser = ({
  status,
  student,
  isLoading,
}: Props): React.ReactElement => {
  const senderId = "SUPPORT";
  const dispatch = useDispatch();
  const [lastMessage, setLastMessage] = useState<IChatMessage>();
  const { getMessages } = useFirebaseChat();

  const {
    first_name: firstName,
    last_name: lastName,
    email,
    active,
    id,
    avatar,
  } = student.account || {};

  const activityColor = useMemo(() => {
    return getActivityColor(status);
  }, [status]);

  useEffect(() => {
    getMessages(
      senderId,
      id,
      (data) => {
        if (!data.length) return;
        setLastMessage(data[0]);
      },
      1
    );
  }, []);

  const socket = useSocket();

  const onConnectStudent = (): void => {
    socket.emit("joinRoom", student.id);
    dispatch(createRabit({ id: student.id, email, avatar }));
  };

  const getSubText = (): string => {
    if (!lastMessage) return "";
    const sender = lastMessage?.sender_id === senderId ? "Me" : firstName;
    return `${sender}: ${lastMessage.text}`;
  };

  return (
    <ListItem sx={{ pl: 0 }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        variant="dot"
        sx={{ "& .MuiBadge-badge": { bgcolor: activityColor } }}
      >
        <LoaderDelay
          skeleton={<AvatarSkeleton />}
          component={
            <Tooltip
              placement="left"
              title={getTooltipAvatarMessage(0, true)}
            >
              <Avatar
                alt={firstName}
                src={
                  avatar ??
                  "https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png"
                }
                sx={{
                  width: { xs: 40, sm: 40, md: 50 },
                  height: { xs: 40, sm: 40, md: 50 },
                  border: `5px solid ${getAvatarColor(0)}`,
                }}
              />
            </Tooltip>
          }
          isLoading={isLoading}
          deley={1000}
        />
      </Badge>
      <Box
        sx={{
          width: "100%",
          pl: 2,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {firstName} {lastName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {getSubText()}
        </Typography>
      </Box>
      <Tooltip
        placement="left"
        title="connect"
      >
        <Box>
          <IconButton disabled={!true} onClick={onConnectStudent}>
            <AddIcon />
          </IconButton>
        </Box>
      </Tooltip>
    </ListItem>
  );
};

function getAvatarColor(time: number | null): string {
  if (isNull(time)) return "#C4C4C4";
  if (time >= 0 && time <= 5) return "#0198ED";
  if (time < 50 && time > 5) return "#E27510";
  return "#C4C4C4";
}

function getTooltipAvatarMessage(
  time: number | null,
  isOnline: boolean
): string {
  if (!isOnline) return "student offline";
  if (isNull(time)) return "was active long time ago";
  if (time === 0 || time <= 5) return "active";
  if (time < 50 && time > 5) return `was active ${time} minutes ago`;
  return "was active long time ago";
}
