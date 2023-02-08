import { Octokit } from "octokit"

const main = async () => {
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPOSITORY)
        throw new Error("Missing GITHUB_TOKEN or GITHUB_REPOSITORY")

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

    const [owner, repo] = process.env.GITHUB_REPOSITORY.trim().split("/")

    const caches = await octokit.rest.actions.getActionsCacheList({ owner, repo })

    for (const cache of caches.data.actions_caches) {
        console.log(`Deleting ${cache.key} (${cache.id})`)

        await octokit.rest.actions.deleteActionsCacheById({
            cache_id: cache.id!,
            owner,
            repo,
        })
    }
    console.log("All cache deleted")
}

main().catch((e) => {
    console.error("ERROR:\n", e)
    process.exit(1)
})
