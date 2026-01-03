import jwt from "jsonwebtoken";

export const signJwt = (obj) => {
    const signedToken = jwt.sign(obj, "secret");
    return signedToken;
}