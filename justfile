upgrade-tex2typst:
    yarn remove tex2typst
    yarn add tex2typst
    npm run test
    git add -A
    git commit -m "bump tex2typst" # `npm version patch` requires git working directory to be clean
    npm version patch --no-git-tag-version # bump version in package.json && git add && git commit && git tag
    npm run deploy
    git push origin

