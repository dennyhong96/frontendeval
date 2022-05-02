export async function search(query) {
  const res = await fetch(`https://api.frontendeval.com/fake/food/${query}`);
  return await res.json();
}
