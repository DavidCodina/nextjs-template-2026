// From Steve Kinney's Advanced Redux With Redux Toolkit, lesson 9 at 2:45
type RequireOnly<T, P extends keyof T> = Pick<T, P> & Partial<Omit<T, P>>

///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   type User = {
//     id: string
//     name: string
//     email: string
//     userName: string
//   }
//
//   type CreateUserInput = RequireOnly<User, 'name' | 'email' | 'userName'>
//
//   const userInput:CreateUserInput = {
//     name: 'David',
//     email: 'david@example.com',
//     userName: 'DaveMan'
//   }
//
///////////////////////////////////////////////////////////////////////////
