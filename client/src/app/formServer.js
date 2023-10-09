"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createRequestCookies(requestData) {
  cookies().set("request", requestData);
  redirect("/results");
}
