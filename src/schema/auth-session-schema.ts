import {object, string} from "zod";

export const createAuthSessionSchema = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }),
        password: string({
            required_error: "Password is required",
        }),
    }),
});