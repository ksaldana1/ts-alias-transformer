export namespace protos {
  export namespace user {
    export interface User {
      username: string;
      info: UserInfo;
    }

    export interface UserInfo {
      firstName: string;
      lastName: string;
    }
  }

  export namespace todo {
    export interface Todo {
      createdBy: protos.user.User;
      text: string;
    }
  }
}
