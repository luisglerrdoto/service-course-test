export async function analytics(ctx: Context, next: () => Promise<any>) {

  await ctx.clients.events.sendEvent('', 'other-event')
 
  ctx.status = 200
  ctx.body = 'OK'
  ctx.set('cache-control', 'no-cache')

  await next()
}
