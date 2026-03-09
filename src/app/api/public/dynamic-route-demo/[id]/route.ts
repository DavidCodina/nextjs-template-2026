import { codes, handleError } from '@/utils'

const users = [
  {
    id: 1,
    name: 'David Codina',
    username: 'DaveMan',
    email: 'david@example.com'
  },
  {
    id: 2,
    name: 'Holly Grant',
    username: 'HollyDolly',
    email: 'holly@example.com'
  },
  {
    id: 3,
    name: 'Muffy Flufferton',
    username: 'FussFace',
    email: 'muffy@example.com'
  },
  {
    id: 4,
    name: 'Punkin Pie',
    username: 'Big Betty',
    email: 'punkin@example.com'
  },
  {
    id: 5,
    name: 'Gingerbread',
    username: 'Orange Menace',
    email: 'gingerbread@example.com'
  }
]

/* ========================================================================

======================================================================== */

export async function GET(
  req: Request,
  // ⚠️ The type RouteContext was added in 15.5.0
  // ctx: RouteContext<'/api/dynamic-route-demo/[id]'>
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const idAsNumber = parseInt(id)
  const user = users.find((u) => u.id === idAsNumber)

  /* ======================
        User Check
  ====================== */

  if (!user) {
    return Response.json(
      {
        code: codes.NOT_FOUND,
        data: null,
        message: 'Resource not found.',
        success: false
      },
      { status: 404 }
    )
  }

  try {
    /* ======================
            Response
    ====================== */

    return Response.json({
      code: codes.OK,
      data: user,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return Response.json(handleError(err, 'Internal server error. (from server API route)'), { status: 500 })
  }
}
