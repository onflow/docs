#!/bin/sh

echo Importing...
repoDataSources="./src/data/data-sources.json"
tempReposLocation="./temp"
docsLocation="./docs"
alias jq='./node_modules/node-jq/bin/jq'

cloneRepoToTemp() {
    repo=$1
    tempRepoLocation=$2
    branch=$3
    if [ -d $tempRepoLocation ]; then
        echo "Skipping $repo (already exists)"
    elif [ ! -z "$branch" ]; then
        git clone -b $branch https://github.com/$repo.git $tempRepoLocation
    else
        git clone https://github.com/$repo.git $tempRepoLocation
    fi
}

cloneDocReposToDest() {
    echo Cloning repos...
    array_length=$(jq 'length' "$repoDataSources")
    # Loop through the array elements
    i=0
    while [ "$i" -lt "$array_length" ]; do
        # get the values using jq
        owner=$(jq -r ".[$i].repository.owner" "$repoDataSources")
        name=$(jq -r ".[$i].repository.name" "$repoDataSources")
        branch=$(jq -r ".[$i].repository.branch" "$repoDataSources")

        repo=$owner/$name
        tempRepoLocation=$tempReposLocation/$name
        # Display the extracted values
        echo "Entry $((i + 1)):"
        echo "Repository Owner: $owner"
        echo "Repository Name: $name"
        echo "Repository Branch: $branch"
        echo
        cloneRepoToTemp $repo $tempRepoLocation

        # copy repo files to finial destination
        data_length=$(jq -r ".[$i].repository.data | length" "$repoDataSources")
        j=0
        while [ "$j" -lt "$data_length" ]; do
            sourceFolder=$(jq -r ".[$i].repository.data[$j].source" "$repoDataSources")
            destFolder=$(jq -r ".[$i].repository.data[$j].destination" "$repoDataSources")
            ignoreFiles=$(jq -r ".[$i].repository.data[$j].ignore" "$repoDataSources")
            doCopy=$(jq -r ".[$i].repository.data[$j].doCopy" "$repoDataSources")
            echo "Data $((j + 1))"
            echo "Source: $sourceFolder"
            echo "Dest: $destFolder"
            echo "Do copy: $doCopy"
            echo

            if [ "$doCopy" = "true" ]; then
                #rm -r $docsLocation/$destFolder
                copyRepoFilesToDest $tempRepoLocation/$sourceFolder $docsLocation/$destFolder

                # if [ "$ignoreFiles" != "null" ]; then
                #     ignore_length=$(echo "$ignoreFiles" | jq '. | length')
                #     echo "$name $ignore_length Ignore files:"
                #     echo "$ignoreFiles" | jq -r '.[]' | while IFS= read -r file; do
                #         echo "Removing: $docsLocation/$destFolder/$file"
                #         rm "$docsLocation/$destFolder/$file"
                #     done
                # fi

            else
                echo "Skipping copy"
            fi

            j=$((j + 1))
        done
        i=$((i + 1))
    done
}

copyRepoFilesToDest() {
    sourceFolderName=$1
    destFolderName=$2
    echo Copying files from $sourceFolderName to $destFolderName

    mkdir -p $destFolderName

    cp -r $sourceFolderName* $destFolderName

    # rsync is not available in vercel
    # rsync -av --include='*/' --include='*.mdx' --include='*.md' --include='*.pdf' --include='*.png' --include='*.gif' --include='*.jpg' --exclude='*' --exclude='flow-docs.json' "${sourceFolderName}/" "${destFolderName}/"
}

cloneDocReposToDest
renameEcosystemOverview
