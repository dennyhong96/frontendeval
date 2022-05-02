export async function convert(currency) {
  const res = await fetch(
    `https://api.frontendeval.com/fake/crypto/${currency}`
  );
  return (await res.json()).value;
}
