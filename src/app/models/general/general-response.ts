export interface GeneralResponse<T> {
  name: string;
  message: string;
  data: Array<T>;
}
