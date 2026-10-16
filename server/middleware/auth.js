import { getAuth } from "@clerk/express";

const auth = (req, res, next) => {
  try {
    console.log("========== AUTH ==========");
    console.log("Authorization:", req.headers.authorization);

    const authData = getAuth(req);

    console.log(authData);

    if (!authData.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    req.userId = authData.userId;

    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      error: "Authentication failed",
    });
  }
};

export default auth;