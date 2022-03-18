import { COURSE_ENTITY } from "../utils/constants"

export async function analytics(ctx: Context, next: () => Promise<any>) {

  //await ctx.clients.events.sendEvent('', 'other-event')
  //const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()

  const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()
  console.log('LIVE USERS ', liveUsersProducts)
  
  await Promise.all(
      liveUsersProducts.map(async ({ slug, liveUsers }) => {

      try {
          const [savedProduct] = await ctx.clients.masterdata.searchDocuments<{
              id: string
              count: number
              slug: string
          }>({
              dataEntity: COURSE_ENTITY,
              fields: ['count', 'id', 'slug'],
              pagination: {
              page: 1,
              pageSize: 1,
              },
              schema: 'v1',
              where: `slug=${slug}`,
          })
          console.log('SAVED PRODUCT', savedProduct)

          await ctx.clients.masterdata.createOrUpdateEntireDocument({
              dataEntity: COURSE_ENTITY,
              fields: {
              count: liveUsers,
              slug,
              },
              id: savedProduct?.id,
              schema: 'v1'
          })

      } catch (error) {
          
          console.log(`failed to update product ${slug}`)
          console.log('error ', error)
      }
  
      })
  )
 
  ctx.status = 200
  ctx.body = liveUsersProducts
  ctx.set('cache-control', 'no-cache')

  await next()
}
