import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
 export default NextAuth(authConfig).auth;



// #############################################################
/* This approach consumes a lot of ram/cpu  */ 

// import { auth as authConfig } from "@/auth";
// export default authConfig;
// export { authConfig as proxy } from "@/auth.config";
