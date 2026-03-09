/* ======================
        getTime()
====================== */

export const getTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })
}
