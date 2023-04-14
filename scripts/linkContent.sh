#!/bin/sh

# Change destinationPrefix to a correct path to documentation portal
# Change repoDataSources to a correct location of data-sources.json file
# Run the script from a repository where you want to change the MD files content

repoName=$(jq -r ".name" "package.json")
repoDataSources="../../src/data/data-sources.json"

destinationPrefix="https://onflow.github.io/docs/next/"
editDestinationPrefix="https://github.com/onflow/docs/tree/main/docs/"

array_length=$(jq 'length' "$repoDataSources")
data=""

echo $array_length

i=0
while [ "$i" -lt "$array_length" ]; do
  matchingRepoName=$(jq -r ".[$i].repository.name" "$repoDataSources")
  if [ "$matchingRepoName" = "$repoName" ]; then
    data_length=$(jq -r ".[$i].repository.data | length" "$repoDataSources")
    j=0
    while [ "$j" -lt "$data_length" ]; do
      sourceFolder=$(jq -r ".[$i].repository.data[$j].source" "$repoDataSources")
      destFolder=$(jq -r ".[$i].repository.data[$j].destination" "$repoDataSources")
      find . -type f \( -name "*.md" -o -name "*.mdx" \) | while read file; do
        if echo "$file" | grep -qE "^./$sourceFolder"; then
          filePath=$file
          filePath=${filePath#./} # remove ./ in the beginning
          filePath=${filePath#$sourceFolder}
          docPath=${filePath%.*} # remove .md and .mdx at the end

          echo "### The documentation has been moved to a new location. Please check the links below." > $file
          echo "$destinationPrefix$destFolder/$docPath" >> $file
          echo "" >> $file
          echo "### To edit this document, go to " >> $file
          echo "$editDestinationPrefix$destFolder/$filePath" >> $file
          echo "" >> $file
        fi
      done
      j=$((j + 1))
    done
  fi

  i=$((i + 1))
done
