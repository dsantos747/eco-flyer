'use server';

import { cookies } from 'next/headers';

export async function createRequestCookies(requestData) {
  const requestDataJSON = JSON.stringify(requestData, null, 2);
  cookies().set('request', requestDataJSON);
}
