// ------------------------------------------------------------------------------------------
// Current Define bloks
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine authHeader
 * @apiHeader {String} Authorization Send access token on Bearer schema
 * @apiHeaderExample {json} Header-Example:
 *    {
 *      "Authorization": "Bearer aliwe.asdasdf.sadghru"
 *    }
 */

/**
 * @apiDefine jwtError
 * @apiError Unauthorized <ul>
 *                          <li>Authorization token not found</li>
 *                          <li>Invalid authorization token</li>
 *                          <li>Authorization expired</li>
 *                        </ul>
 */

// ------------------------------------------------------------------------------------------
// Current Success
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Errors
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine 404
 * @apiErrorExample Error-Response
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error":{
 *       "message": "NotFound"
 *       }
 *   }
 */

/**
 * @apiDefine 403
 * @apiErrorExample Error-Response
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "error":{
 *       "message": "Forbidden"
 *       }
 *   }
 */

/**
 * @apiDefine 401
 * @apiErrorExample Error-Response
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "error":{
 *       "message": "Invalid token"
 *       }
 *   }
 * @apiErrorExample Error-Response
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "error":{
 *       "message": "No authorization token was found"
 *       }
 *   }
 * @apiErrorExample Error-Response
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "error":{
 *       "message": "jwt expired"
 *       }
 *   }
 */

/**
 *@apiDefine 400
 * @apiErrorExample Error-Response
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error":{
 *       "message": "BadRequest"
 *       }
 *   }
 */

/**
 *@apiDefine 406
 * @apiErrorExample Error-Response
 *   HTTP/1.1 406 Not Acceptable
 *   {
 *     "error":{
 *       "message": "NotAcceptable"
 *       }
 *   }
 */

/**
 *@apiDefine 409
 * @apiErrorExample Error-Response
 *   HTTP/1.1 409 Conflict
 *   {
 *     "error":{
 *       "message": "Conflict"
 *       }
 *   }
 */

// ------------------------------------------------------------------------------------------
// Current Permissions
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// History
// ------------------------------------------------------------------------------------------
