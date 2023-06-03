/**
 * query{
 *        client_id = h3as22hu
 *        timestamp = 1666349141015
 * }
 * headers{
 *        access_token = c025e1548ec3ec6b0bdfcc6e1e5b6f17
 *        api_key = h3shAs220prIYhu1nK43as97h2fA4Rm34hd8a89dfa
 * }
 */

const md5 = require("md5");
const timestampLimitInSecond = 120; //request timeout in 120 seconds (2 minutes)

const validateCredential = (req, res, next) => {
  console.log("validating-credential");
  const apiSecret = req.get("api_key") || "";

  const reqTimestamp = req.query.timestamp || 0;
  const currentTimestamp = new Date().valueOf();
  const allowedTimestamp =
    parseInt(reqTimestamp) + timestampLimitInSecond * 1000;
  // if (currentTimestamp > allowedTimestamp) {
  //   res.status(401).json({
  //     message: "Authorization Failed.",
  //   });
  //   return;
  // }

  const query = req.url.split("?")[1] || "";
  const computedAccessToken = computeAccessToken(apiSecret, query);

  console.log(computedAccessToken, ' <=====> ', req.get("access_token"));

  if (computedAccessToken === req.get("access_token")) {
    next();
  } else {
    res.status(401).json({
      message: "Authorization Failed.",
    });
    return;
  }
};

const computeAccessToken = (apiSecret, query) => {
  const reqUrlSearchParams = new URLSearchParams(query);
  const params = Object.fromEntries(reqUrlSearchParams.entries());

  const sortedStr = Object.keys(params)
    .sort()
    .map((paramKey) => `${paramKey}=${params[paramKey]}`)
    .join("&3&");
  const computedAccessToken = md5(sortedStr + apiSecret).toString();
  return computedAccessToken;
};

module.exports = {
  validateCredential,
  computeAccessToken,
};