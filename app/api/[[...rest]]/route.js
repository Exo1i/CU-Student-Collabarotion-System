// app/api/[[...rest]]/route.ts

import {NextPostgrest} from "next-postgrest";

export const {GET, POST, PUT, DELETE, PATCH} = NextPostgrest({
    url: "http://127.0.0.1:3333",
    basePath: "/api/admin",
    before({pathname, searchParams, view, request}) {
    },
});