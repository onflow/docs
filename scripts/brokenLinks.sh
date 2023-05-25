./bootstrap.sh

grep -r --include='*.md' --include='*.mdx' "developers.flow" ./ > links.txt 
grep -r --include='*.md' --include='*.mdx' "developers.onflow" ./ >> links.txt
grep -r --include='*.md' --include='*.mdx' "docs.flow" ./ >> links.txt
grep -r --include='*.md' --include='*.mdx' "docs.onflow" ./ >> links.txt

# regex to remove non-url content (https://[0-9a-z.x/x\-]+).+
# HTTP/2 [23]0[0-9] (\n.+){1,20}

while IFS= read -r line; do
  echo $line && curl -L --max-redirs 5 -I $line
done < links.txt > 404.txt