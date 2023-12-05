export async function POST(req: Request) {
  const res = await req.json();

  console.log('res : ', res);

  return Response.json({
    status: 'success',
    message: 'Hello from the other side',
    res
  });
}
