/* ======================
    
====================== */

export const parseResponse = async (response: Response) => {
  try {
    const json = await response.json()
    return json
  } catch (_err) {
    return null
  }
}
