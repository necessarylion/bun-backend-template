export function responseParser(res: any) {
 // if already response object, return it
 if (res instanceof Response) return res
 // if object, return json response
 if (res instanceof Object) return Response.json(res)
 // else return string response
 return new Response(res)
}