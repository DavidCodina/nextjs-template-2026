export const createConnection = (roomId: string) => {
  void roomId

  return {
    on: (event: string, callback: () => void) => {
      if (event === 'connected') {
        callback()
      }
    },
    disconnect: () => {
      console.log('Disconnected from Chat Room!')
    }
  }
}
