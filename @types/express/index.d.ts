import { User } from "@prisma/client";

//add this in tsconfig.json file to resolve error of authUser property not found in request object
// "typeRoots": [
//   "@types",
//   "node_modules/@types"
// ]
declare global {
  namespace Express {
    interface Request {
      authUser: User;
    }
  }
}
