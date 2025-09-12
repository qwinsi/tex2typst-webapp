upgrade-tex2typst:
    yarn remove tex2typst
    yarn add tex2typst
    npm run test
    npm run deploy
    git add -A
    git commit -m "bump tex2typst"
    git push origin
