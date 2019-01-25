import { protos } from '../external/protos';

export type User = {
  user: protos.user.User;
  todo: protos.todo.Todo;
};
