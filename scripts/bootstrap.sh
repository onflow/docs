#!/bin/sh

echo Bootstrapping...

docCollectionsLocation="../src/data/doc-collections"
tempReposLocation="../temp"
docsLocation="../docs"

# cloneRepoToTemp $repo $tempRepoLocation
cloneRepoToTemp () {
  if [ -d $1 ] 
  then
    echo "Skipping $1 (already exists)"
  else
    git clone git@github.com:$1.git $2
  fi
}

fixLiCloseTag () {
  searchString="(#ftype)\n<\/div>"
  replaceString="(#ftype)\n\n<\/div>"
  
  cp $1 $1.original
  tr $searchString $replaceString < $1.original > $1
  rm $1.original
}

cleanUp () {
  echo Clean up...
  rm $docsLocation/flow-cli/template.md
  rm $docsLocation/flow/content/status.mdx
  rm $docsLocation/flow/content/index.mdx
  rm $docsLocation/flow/content/http-api.mdx
  rm $docsLocation/flow/content/nft-catalog/composability-nft-guide.mdx
  rm $docsLocation/flow/content/sdks.mdx

  fixLiCloseTag $docsLocation/mock-developer-doc/api.mdx
  fixLiCloseTag $docsLocation/mock-developer-doc/fclapi.mdx
  fixLiCloseTag $docsLocation/fcl-js/reference/api.md
  
  # fix missing community link
  sed -i.original 's/\[Flow\ community\]\((\))/[Flow community](https:\/\/developers.flow.com\/community)/' $docsLocation/flow/content/nodes/index.mdx

  # escape tag symbols for <version>
  sed -i.original 's/<version>/<version\\>/' $docsLocation/flow/content/unity-sdk/samples/flow-words-tutorial.md

  cp $docsLocation/flow/content/concepts/flowscan-fees.png ../static/
}

cloneDocReposToTemp () {
  echo Cloning repos...
  for fileName in $docCollectionsLocation/*.json
  do
    repoSource=$(cat $fileName | jq .source)
    # repo=( ["owner"]=($repoSource | jq .owner))
    # echo $repoSource
    owner=$(echo $repoSource | jq -r .owner)
    name=$(echo $repoSource | jq -r .name)
    rootPath=$(echo $repoSource | jq -r .rootPath)

    repo=$owner/$name
    tempRepoLocation=$tempReposLocation/$name

    cloneRepoToTemp $repo $tempRepoLocation
  done
}

cloneDocFiles () {

  echo Copying files...
  for dirName in $tempReposLocation/*/
  do
    destination=$docsLocation/$(basename $dirName)
    if [ -d $destination ] 
    then
      echo "Skipping $destination (already exists)"
    else
      cp -r $dirName/docs $docsLocation/$(basename $dirName)
    fi
  done
}

bootstrapDevPortal () {
  echo Bootstrapping dev portal
  cloneRepoToTemp onflow/developer-portal $tempReposLocation/developer-portal

  rm -rf $docCollectionsLocation
  mkdir -p $docCollectionsLocation
  cp -r $tempReposLocation/developer-portal/app/data/doc-collections/ $docCollectionsLocation
}

bootstrapDevPortal

cloneDocReposToTemp

cloneDocFiles

cleanUp