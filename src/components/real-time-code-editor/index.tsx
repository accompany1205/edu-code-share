import React, {useCallback, useEffect, useState} from "react";

import { Socket } from "socket.io-client";

import { CodeEditor } from "./editor";
import { getDocument } from "../../codemirror/extensions/collab";

interface State {
  connected: boolean;
  version?: number;
  doc?: string;
}

interface IRealTimeCodeEditor {
  connectionType?: "connect" | "create";
  onChangeCode: (value: string) => void;
  colabCursonId: string;
  colabCursonText: string;
  roomId: string;
  socket: Socket;
}

export const RealTimeCodeEditor = ({
  socket,
  roomId,
  colabCursonId,
  colabCursonText,
  connectionType = "connect",
  onChangeCode,
}: IRealTimeCodeEditor): React.ReactElement | null => {
  const [state, setState] = useState<State>({
    connected: false,
    version: undefined,
    doc: undefined,
  });

  /**
   * Gets and sets the initial document data.
   * If no/invalid data is returned, it tries again every 3 seconds.
   */
  async function initializeData() {
    const { version, doc } = await getDocument(socket, roomId);

    // If no data is returned, try again in 3 seconds
    if (version === undefined || !doc) {
      setTimeout(() => {
        initializeData();
      }, 3000);
      return;
    }

    setState((prev) => ({
      ...prev,
      version,
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      doc: doc?.toString(),
    }));
  }

  const initializeConnection = useCallback(async () => {
    socket.emit(connectionType === "connect" ? "joinRoom" : "create", roomId);
    await initializeData();
  }, [socket, initializeData]);

  useEffect(() => {
    socket.open();

    if(socket.connected) {
      void initializeConnection();
      setState((prev) => ({
        ...prev,
        connected: true,
      }));
    } else {
      socket.once("connect", initializeConnection);
    }

    socket.on("connect", () => {
      setState((prev) => ({
        ...prev,
        connected: true,
      }));
    });

    socket.on("disconnect", () => {
      setState((prev) => ({
        ...prev,
        connected: false,
      }));
    });

    window.addEventListener("beforeunload", () => {
      socket.emit(
        connectionType === "connect" ? "leaveRoom" : "deleteRoom",
        roomId
      );
      socket.off("connect");
      socket.off("disconnect");
      socket.close();
    });

    return () => {
      setState((prev) => ({
        ...prev,
        version: undefined,
        doc: undefined,
      }));
      socket.emit(
        connectionType === "connect" ? "leaveRoom" : "deleteRoom",
        roomId
      );
      socket.off("connect");
      socket.off("disconnect");
      socket.close();
      socket.disconnect();
    };
  }, [roomId]);

  if (
    state?.version === undefined ||
    state?.doc === undefined ||
    !state.connected
  ) {
    return null;
  }

  return (
    <>
      <style>
        {`
          .cm-editor {
            height: 100vh;
          }
        `}
      </style>
      <CodeEditor
        roomId={roomId}
        onChangeCode={onChangeCode}
        state={state}
        cursorId={colabCursonId}
        cursorText={colabCursonText}
        socket={socket}
      />
    </>
  );
};

export default React.memo(RealTimeCodeEditor);
