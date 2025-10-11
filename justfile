upgrade-tex2typst:
    bun update tex2typst
    bun test
    npm version patch --no-git-tag-version # bump version in package.json
    git add -A
    git commit -m "bump tex2typst" # `npm version patch` requires git working directory to be clean
    npm run deploy
    git push origin

