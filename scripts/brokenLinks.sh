# ./scripts/bootstrap.sh

link_file="links.txt"
s404_file="404.txt"

# grep -r --include='*.md' --include='*.mdx' "developers.flow" ./ > "$link_file" 
# grep -r --include='*.md' --include='*.mdx' "developers.onflow" ./ >> "$link_file"
# grep -r --include='*.md' --include='*.mdx' "docs.flow" ./ >> "$link_file"
# grep -r --include='*.md' --include='*.mdx' "docs.onflow" ./ >> "$link_file"

touch "$s404_file"

while IFS= read -r url; do
    response=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
    if [[ $response -eq 404 ]]; then
        echo $url >> "$s404_file"
    fi
done < "$link_file"
