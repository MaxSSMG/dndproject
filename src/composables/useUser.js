import { useJsonStore } from "@/composables/useJsonStore";

export function useUser() {
  const { login: findUser, register: createUser, getName: getUserName } = useJsonStore();

  async function login(username, password) {
    const user = findUser(username, password);

    if (user) {
      $cookies.set("userId", user.id, "1h");
    }

    return user;
  }

  async function register(username, password) {
    return createUser(username, password);
  }

  async function getName(id) {
    return getUserName(id);
  }

  return {
    login,
    register,
    getName,
  };
}
