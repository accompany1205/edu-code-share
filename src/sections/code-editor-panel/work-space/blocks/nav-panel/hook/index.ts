import {
  type MutableRefObject,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { useFilters } from "@hooks";
import { useSocket } from "@hooks";
import { BaseResponseInterface } from "@utils";
import { IFriend } from "src/redux/interfaces/friends.interface";
import { useGetFriendsStudentContentQuery } from "src/redux/services/manager/friends-manager";
import { useSelector } from "src/redux/store";

import { type DraggableBlockConfig, getDraggableBlockConfig } from "./utils";

type FriendUser = IFriend & BaseResponseInterface;

interface UseNavPanelReturn {
  drawerRef: MutableRefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onAddBlock: (user: FriendUser) => void;
  setIsOpen: (isOpen: boolean) => void;
  onDragEnd: (e: DragEndEvent) => void;
  onDeletePreviewUser: (id: string) => void;
  previewdUsers: FriendUser[];
  draggableConfig: DraggableBlockConfig | null;
  users: FriendUser[];
  setUsers: Function;
  isCodePreviewVisible: boolean;
  activeUsersAmount: number;
  isCodeBlocksVisible: boolean;
  isUsersLoading: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
}

const DEFAULT_FILTERS = { take: 50, page: 1 };
const FILTER_NAME = "page";

export const useNavPanel = (
  wrapperListenerRef: RefObject<HTMLDivElement | null>
): UseNavPanelReturn => {
  const socket = useSocket();
  console.log("socket:", socket);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [previewdUsers, setPreviewdUsers] = useState<FriendUser[]>([]);
  const [draggableConfig, setDraggableConfig] =
    useState<DraggableBlockConfig | null>(null);
  const isCodePreviewVisible = useSelector(
    (state) => state.codePanelGlobal.isCodePreviewVisible
  );
  const [isCodeBlocksVisible, setIsCodeBlocksVisible] = useState(false);

  const classId = useSelector(state => state?.codePanel?.class?.id);
  const { filters, setFilter } = useFilters(DEFAULT_FILTERS)

  const [users, setUsers] = useState<FriendUser[]>([]);

  const { data, isLoading: isUsersLoading } =
    useGetFriendsStudentContentQuery(filters);

  useEffect(() => {

    setFilter("class_id", classId as string)
  }, [classId])

  const onLoadMore = () => {
    if (data == null || data.meta.hasNextPage === false) {
      return;
    }

    setFilter(FILTER_NAME, data.meta.page + 1);
  };

  const onAddBlock = (user: FriendUser): void => {
    const newPreviewedUsers = [...previewdUsers];
    const isMaxBlocksInView =
      newPreviewedUsers.length === draggableConfig?.blockAmount;
    const isExist = newPreviewedUsers.some(({ id }) => id === user.id);
    console.log({ user });
    if (isExist) {
      return;
    }

    if (isMaxBlocksInView) {
      newPreviewedUsers.splice(newPreviewedUsers.length - 1, 1);
      setPreviewdUsers([...newPreviewedUsers, user]);

      return;
    }

    setPreviewdUsers([...newPreviewedUsers, user]);
  };

  const onDeletePreviewUser = (_id: string): void => {
    const index = previewdUsers.findIndex(({ id }) => id === _id);

    if (index > -1) {
      const newPreviewdUsers = [...previewdUsers];
      newPreviewdUsers.splice(index, 1);
      setPreviewdUsers(newPreviewdUsers);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over != null && active != null && active.id !== over.id) {
      setPreviewdUsers((items) => {
        const oldIndex = items.findIndex(({ id }) => id === active.id);
        const newIndex = items.findIndex(({ id }) => id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (wrapperListenerRef.current != null) {
      const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        const config = getDraggableBlockConfig(contentRect);

        setDraggableConfig(config);
        setPreviewdUsers((prev) =>
          config.blockAmount < prev.length
            ? prev.slice(0, config.blockAmount)
            : prev
        );
      });

      resizeObserver.observe(wrapperListenerRef.current);
    }

    return () => {
      if (wrapperListenerRef.current != null) {
        resizeObserver?.unobserve(wrapperListenerRef.current);
      }
    };
  }, [wrapperListenerRef]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isCodePreviewVisible) {
      setIsCodeBlocksVisible(false);
      setIsOpen(false);
    } else {
      timeout = setTimeout(() => {
        setIsCodeBlocksVisible(true);
      }, 400);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isCodePreviewVisible]);

  useEffect(() => {
    if (data?.data != null) {
      setUsers((prev) => [
        ...prev,
        ...data.data.map((_user) =>
          _user.status ? _user : { ..._user, status: "inactive" }
        ),
      ]);
    }
  }, [data?.data]);

  const { activeUsersAmount, sortedUsers } = useMemo(() => {
    const statusOrder: { [status: string]: number } = {
      active: 1,
      idle: 2,
      inactive: 3,
    };
    const sortedUsers = users;
    const activeUsersAmount = users.filter(
      ({ status }) => status !== "inactive"
    ).length;
    sortedUsers.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    return { activeUsersAmount, sortedUsers };
  }, [users]);

  return {
    drawerRef,
    isOpen,
    onAddBlock,
    setIsOpen,
    onDragEnd,
    onDeletePreviewUser,
    previewdUsers,
    draggableConfig,
    activeUsersAmount,
    users: sortedUsers,
    setUsers,
    isCodePreviewVisible,
    isCodeBlocksVisible,
    isUsersLoading,
    onLoadMore,
    hasNextPage: data?.meta.hasNextPage ?? false,
  };
};
