export function createPublishableKeySafeFetch(publishableKey: string): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);
    const authorization = headers.get("Authorization");

    if (authorization === `Bearer ${publishableKey}`) {
      headers.delete("Authorization");
    }

    return fetch(input, {
      ...init,
      headers,
    });
  };
}
