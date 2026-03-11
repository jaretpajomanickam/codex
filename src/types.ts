export type ID = string;

export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";
export type StoryPoint = 1 | 2 | 3 | 5 | 8 | 13;

export type VoteMap = Record<ID, StoryPoint | undefined>;

export interface Member {
  id: ID;
  name: "Moin" | "Peter" | "James" | "Jaret";
  roleLabel: string;
  bio: string;
  avatarColor: string;
  reliabilityScore: number;
  contributionScore: number;
}

export interface Comment {
  id: ID;
  authorId: ID;
  body: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: ID;
  type:
    | "task_created"
    | "task_moved"
    | "vote_cast"
    | "voting_closed"
    | "task_assigned"
    | "comment_added"
    | "deadline_warning";
  createdAt: string;
  message: string;
}

export interface Task {
  id: ID;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;

  assigneeId?: ID;

  votingOpen: boolean;
  votes: VoteMap;
  officialPoints?: number;
  averagePoints?: number;
  voteDisagreementLevel?: "low" | "medium" | "high";

  comments: Comment[];
  activity: ActivityEvent[];
}

export interface NotificationItem {
  id: ID;
  type:
    | "vote_needed"
    | "task_overdue"
    | "task_assigned"
    | "member_overloaded"
    | "vote_disagreement"
    | "deadline_approaching";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  taskId?: ID;
  memberId?: ID;
}

export interface Team {
  id: ID;
  name: string;
  projectName: string;
  members: Member[];
}

export interface SessionState {
  signedIn: boolean;
  currentUserId: ID;
}

export interface AppState {
  team: Team;
  tasks: Task[];
  notifications: NotificationItem[];
  session: SessionState;
}