'use server';

import { cookies } from 'next/headers';

export async function createRequestCookies(cookieName, requestData) {
  const requestDataJSON = JSON.stringify(requestData, null, 2);
  cookies().set(cookieName, requestDataJSON);
}

export async function getCookies(cookieName) {
  const cookie = await JSON.parse(cookies().get(cookieName)?.value);
  return cookie;
}
