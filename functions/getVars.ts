/// <reference types="./type.d.ts" />

export const onRequestGet: PagesFunction<Env> = async (context) => {
  return new Response(context.env.SUBSCRIPTION_PATH)
}
