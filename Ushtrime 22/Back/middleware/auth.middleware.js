import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const sercertKey = process.env.SECRET_KEY;

export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }
  console.log(authHeader, "authHeader");
  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, sercertKey);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token" });
  }
};
export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied, insufficient permissions" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied, insufficient permissions" });
    }
    next();
  };
};
