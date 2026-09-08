export type Category =
  | "amor"
  | "relacionamentos"
  | "familia"
  | "dinheiro"
  | "moralidade"
  | "identidade"
  | "medo"
  | "poder"
  | "futuro"
  | "segredo"
  | "status"
  | "escolhas"
  | "comportamento";

export type QuestionType = "binary" | "choice" | "open";

export type ProfileDimension =
  | "freedom"
  | "security"
  | "money"
  | "relationships"
  | "status"
  | "risk"
  | "moral";

export interface Question {
  id: number;
  text: string;
  category: Category;
  type: QuestionType;
  options: string[];
  dims: ProfileDimension[];
  curiosity: number;
  ego: number;
  comparison: number;
  shareability: number;
  depth: number;
  contradiction: number;
  friendShare: number;
  difficulty: number;
}

export interface AnsweredQuestion {
  id: number;
  category: Category;
  type: QuestionType;
  optionIndex: number;
  answerText: string;
  dims: ProfileDimension[];
  answeredAt: number;
}

export type UserProfile = Record<ProfileDimension, number>;
