import { Stack } from "@mui/system";

import { ResizerUi } from "@components";

import { CodePanel } from "./code-panel";
import { QuickRabbits } from "./quick-rabbits";
import { TopBar } from "./top-bar";
import { SocketContext } from "../../context/socket-context";
import { useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "../../auth/useAuthContext";

export const TeacherPanel = (): React.ReactElement => {
  const { user } = useAuthContext();
  const socket = useRef<Socket | undefined>();

  const getSocket = useCallback(() => {
    if (socket.current) {
      return socket.current;
    }
    socket.current = io(process.env.NEXT_PUBLIC_CODE_STREAM_API ?? "", { path: "/", auth: user ? { userId: user.id } : {} })
    return socket.current;
  }, [socket]);

  return (
    <SocketContext.Provider value={getSocket()}>
      <Stack>
        <TopBar />
        <Stack sx={{ position: "relative", height: "calc(100vh - 50px)" }}>
          <ResizerUi
            split="vertical"
            maxSize={-100}
            minSize={550}
            defaultSize={550}
          >
            <CodePanel />
            <QuickRabbits />
          </ResizerUi>
        </Stack>
      </Stack>
    </SocketContext.Provider>
  );
};
