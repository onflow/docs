
# run this script inside of a repository where you want to replace docs content
# with links pointing to their new location in the docs repo
# use a matching yaml file from ../src/data/pathMapping
#
# example
#
# > cd flow
# > ../flow-docs/scripts/replaceContent.sh ../flow_docs/src/data/pathMapping/flow.yml
#

repoPath="https://github.com/onflow/docs/tree/main/"

ymlFile=$1

yq eval 'to_entries | .[] | .key + ":" + .value' $ymlFile | while read line; do
  filePath=$(echo $line | cut -d':' -f1)
  newLocation=$(echo $line | cut -d':' -f2)
  echo "# This document has been moved to a new location:\n" > $filePath
  echo "$repoPath$newLocation" >> $filePath
done
