/* ======================
    
====================== */

/**
 * Attempts to parse the JSON body from a Request object.
 *
 * @param request - The Request object containing the body to parse
 * @returns The parsed JSON body if successful, null if parsing fails
 */
export const parseRequest = async (request: Request) => {
  try {
    const body = await request.json()

    return body
  } catch (_err) {
    return null
  }
}
