import jwt from "jsonwebtoken";

const authenToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  // gui len tu client co dang 'Beaer [token]'
  const token = authorizationHeader.split(" ")[1];

  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, data: any) => {
    if (err) res.sendStatus(403);
    res.locals.id = data.id;
    next();
  });
};

export default authenToken;
