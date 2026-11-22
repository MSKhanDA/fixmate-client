import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false, input: true },
        phone: { type: "string", required: false, input: false },
        area: { type: "string", required: false, input: false },
        bio: { type: "string", required: false, input: false },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
