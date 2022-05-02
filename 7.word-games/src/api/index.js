export async function getWord() {
  const res = await fetch("https://api.frontendeval.com/fake/word");
  // return 'hello'
  return await res.text();
}

export async function validate(word) {
  const res = await fetch(`https://api.frontendeval.com/fake/word/valid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ word })
  });
  return (await res.text()) === "true";
}
