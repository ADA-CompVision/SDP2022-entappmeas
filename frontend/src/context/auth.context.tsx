import { useLocalStorage } from "@mantine/hooks";
import { PropsWithChildren, useEffect, useReducer } from "react";
import { NewUser, UserWithoutPassword } from "../../../src/types/user.type";
import axios from "../utils/axios";
import { createCtx } from "../utils/helpers";
import { isValidToken } from "../utils/jwt";

type AuthContextType = {
  isInitialized: boolean;
  user: UserWithoutPassword | null;
  register: (user: NewUser) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthActionType =
  | { type: "initialize"; payload: UserWithoutPassword | null }
  | { type: "login"; payload: UserWithoutPassword | null }
  | { type: "logout" };

const initialState: Omit<AuthContextType, "register" | "login" | "logout"> = {
  isInitialized: false,
  user: null,
};

const reducer = (state: typeof initialState, action: AuthActionType) => {
  switch (action.type) {
    case "initialize":
      return { ...state, isInitialized: true, user: action.payload };
    case "login":
      return { ...state, user: action.payload };
    case "logout":
      return { ...state, user: null };
    default:
      throw new Error("Invalid reducer type");
  }
};

export const [useAuthContext, Provider] = createCtx<AuthContextType>();

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useLocalStorage<string | undefined>({
    key: "token",
  });

  const setAccessToken = (token?: string) => {
    setToken(token);

    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        if (token && isValidToken(token)) {
          setAccessToken(token);

          const { data: user } = await axios.get<UserWithoutPassword>(
            "auth/account",
          );

          dispatch({ type: "initialize", payload: user });
        } else {
          dispatch({
            type: "initialize",
            payload: null,
          });
        }
      } catch (error) {
        dispatch({
          type: "initialize",
          payload: null,
        });
      }
    };

    initialize();
  }, [token]);

  const register = async (user: NewUser) => {
    try {
      await axios.post("auth/register", user);
    } catch (error) {
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const {
        data: { user, accessToken },
      } = await axios.post<{
        user: UserWithoutPassword;
        accessToken: string;
      }>("auth/login", { username, password });

      setAccessToken(accessToken);
      dispatch({ type: "login", payload: user });
    } catch (error) {
      dispatch({ type: "login", payload: null });
      throw error;
    }
  };

  const logout = async () => {
    setAccessToken();
    dispatch({ type: "logout" });
  };

  return (
    <Provider value={{ ...state, register, login, logout }}>
      {children}
    </Provider>
  );
};
