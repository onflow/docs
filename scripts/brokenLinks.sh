# ./scripts/bootstrap.sh

all_link_file="alllinks.txt"
link_file="links.txt"
s404_file="404.txt"

## put all links from md/mdx files into a file

# touch "$all_link_file"
# grep -r --include='*.md' --include='*.mdx' "developers.flow" ./ >> "$all_link_file" 
# grep -r --include='*.md' --include='*.mdx' "developers.onflow" ./ >> "$all_link_file"
# grep -r --include='*.md' --include='*.mdx' "docs.flow" ./ >> "$all_link_file"
# grep -r --include='*.md' --include='*.mdx' "docs.onflow" ./ >> "$all_link_file"

## missing step:
## put cleaned links into $link_file

## request all urls and log ones with status 404

# touch "$s404_file"
# while IFS= read -r url; do
#     response=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
#     if [[ $response -eq 404 ]]; then
#         echo $url >> "$s404_file"
#     fi
# done < "$link_file"
