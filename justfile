upgrade-tex2typst:
    bun update tex2typst
    bun test
    npm run build # bun run build fails with "cp: illegal option -- r". This is strange.
    # npm version patch --no-git-tag-version # bump version in package.json
    bun pm version patch --no-git-tag-version
    git add -A
    git commit -m "bump tex2typst" # `npm version patch` requires git working directory to be clean
    git push origin

