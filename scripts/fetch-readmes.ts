interface Repo {
  name: string;
  description: string;
  url: string;
  primaryLanguage: { name: string } | null;
  languages: Array<{ size: number; node: { name: string } }>;
  isFork: boolean;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  createdAt: string;
}

const repos: Repo[] = JSON.parse(await Bun.file("repos.json").text());
const output: Record<string, string> = {};

// Process in parallel batches of 10
const batchSize = 10;
for (let i = 0; i < repos.length; i += batchSize) {
  const batch = repos.slice(i, i + batchSize);
  await Promise.all(
    batch.map(async (repo) => {
      try {
        const proc = Bun.spawn([
          "gh", "api", `repos/jimitchavdadev/${repo.name}/readme`, "--jq", ".content"
        ]);
        const text = await new Response(proc.stdout).text();
        await proc.exited;

        if (text.trim() && !text.includes("Not Found")) {
          const decoded = Buffer.from(text.trim(), "base64").toString("utf-8");
          output[repo.name] = decoded.slice(0, 800).replace(/\r?\n/g, " ");
        } else {
          output[repo.name] = "";
        }
      } catch {
        output[repo.name] = "";
      }
    })
  );
  console.log(`Processed ${Math.min(i + batchSize, repos.length)}/${repos.length} repos`);
}

await Bun.write("readmes.json", JSON.stringify(output, null, 2));
console.log("Finished fetching READMEs.");
