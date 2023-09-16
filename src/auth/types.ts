// ----------------------------------------------------------------------

export type ActionMapType<M extends Record<string, any>> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export interface AuthStateType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
}

// ----------------------------------------------------------------------

export interface JWTContextType {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  authenticate: () => void;
  login: (email: string, password: string, tenantName: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    tenantName?: string
  ) => Promise<void>;
  registerToOrganization: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (token: string) => Promise<void>;
  registerWithGoogle: (token: string) => Promise<void>;
}
