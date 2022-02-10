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
 *                          <li>Authorization token expired</li>
 *                        </ul>
 */

/**
 * @apiDefine pagination
 * @apiParam (Query string) {Number{1-100}} [limit=10] Count of returned items
 * @apiParam (Query string) {Number} [offset=0]
 */

// ------------------------------------------------------------------------------------------
// Current Success
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine 201
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *    "data": null
 *   }
 */

/**
 * @apiDefine 204
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 *   {
 *    "data": null,
 *   }
 */

// ------------------------------------------------------------------------------------------
// Current Errors
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine 400
 * @apiErrorExample Error-Response
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error":{
 *       "message": "BadRequest"
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
 *@apiDefine 409
 * @apiErrorExample Error-Response
 *   HTTP/1.1 409 Conflict
 *   {
 *     "error":{
 *       "message": "Entity already exists"
 *       }
 *   }
 */

/**
 * @apiDefine 429
 * @apiErrorExample Error-Response
 *   HTTP/1.1 429 Too Many Requests
 *   {
 *     "error":{
 *       "message": "Too Many Requests"
 *       "desctiption": "You sent to many requests. Please try again in a few minutes"
 *       }
 *   }
 */

// ------------------------------------------------------------------------------------------
// Current Permissions
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine public Public
 * Can be used by anyone
 */

/**
 * @apiDefine authenticated Authenticated
 * Only for authenticated user with any role
 */

// ------------------------------------------------------------------------------------------
// History
// ------------------------------------------------------------------------------------------
