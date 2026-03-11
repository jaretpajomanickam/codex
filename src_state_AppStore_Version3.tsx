import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { AppState, ID, StoryPoint, TaskStatus } from "../types";
import { seededState } from "../mock/seed";
import { storage } from "../mock/storage";
import { taskService } from "../services/taskService";
import { voteService } from "../services/voteService";

type Action =
  | { type: "session/signIn"; userId: ID }
  | { type: "session/signOut" }
  | { type: "notifications/markRead"; notificationId: ID }
  | { type: "notifications/markAllRead" }
  | { type: "task/move"; taskId: ID; to: TaskStatus }
  | { type: "task/assign"; taskId: ID; assigneeId?: ID }
  | { type: "vote/cast"; taskId: ID; memberId: ID; points: StoryPoint }
  | { type: "vote/close"; taskId: ID }
  | { type: "task/reorder"; status: TaskStatus; orderedIds: ID[] }
  | { type: "app/reset" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "session/signIn":
      return { ...state, session: { signedIn: true, currentUserId: action.userId } };

    case "session/signOut":
      storage.clear();
      return { ...seededState, session: { signedIn: false, currentUserId: "jaret" } };

    case "notifications/markRead":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };

    case "notifications/markAllRead":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };

    case "task/move":
      return taskService.updateTaskStatus(state, action.taskId, action.to);

    case "task/assign":
      return taskService.updateTaskAssignee(state, action.taskId, action.assigneeId);

    case "vote/cast":
      return voteService.castVote(state, action.taskId, action.memberId, action.points);

    case "vote/close":
      return voteService.closeVoting(state, action.taskId);

    case "task/reorder":
      return taskService.reorderWithinStatus(state, action.status, action.orderedIds);

    case "app/reset":
      storage.clear();
      return { ...seededState };

    default:
      return state;
  }
}

type Store = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => storage.load() ?? seededState, []);
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    storage.save(state);
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppStore must be used within AppStoreProvider");
  return v;
}