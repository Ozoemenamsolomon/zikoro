export type RequestStatus = {
  isLoading: boolean;
  error: boolean;
};

export type UseGetResult<T, K extends string, L extends string> = {
  [Key in K]: T | null;
} & { [Action in L]: () => Promise<void> } & RequestStatus;

export type usePostResult<T, K extends string, U = void> = {
  [Action in K]: ({ payload }: { payload: T }) => Promise<U>;
} & RequestStatus;
