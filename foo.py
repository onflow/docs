import os
import re

def update_markdown_links(folder_path, old_folder, new_folder):
    # Define the regular expression pattern to match Markdown links
    link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'

    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            if file_name.endswith(('.md', '.mdx')):
                file_path = os.path.join(root, file_name)
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        content = file.read()

                    # Find and replace links using re.sub
                    updated_content = re.sub(link_pattern, lambda match: update_link(match, old_folder, new_folder, file_path), content)

                    # Write the updated content back to the file
                    with open(file_path, 'w', encoding='utf-8') as file:
                        file.write(updated_content)

                    #print(f'Links in {file_path} have been updated.')
                except FileNotFoundError:
                    print(f"Error: {file_path} not found.")

def update_link(match, old_folder, new_folder, base_url):
    link_text = match.group(1)
    link_url_top = match.group(2)

    if link_url_top.startswith('http'):
        return f'[{link_text}]({link_url_top})'

    link_url = os.path.abspath(os.path.join(base_url, link_url_top))

    if os.path.commonpath([os.path.abspath(base_url), new_folder]) == new_folder:
        # Determine the new path relative to old_folder
        relative_path = os.path.relpath(base_url, new_folder)
        used_to_be = os.path.join(old_folder, relative_path)
        linked_path = os.path.join(used_to_be, link_url_top)

        if(os.path.abspath(linked_path).startswith(os.path.abspath(old_folder))):
            return f'[{link_text}]({link_url_top})'

        updated_url = os.path.normpath(os.path.relpath(linked_path, base_url))

        if not updated_url.startswith('.'):
            updated_url = './' + updated_url
        
        print(f'Updated link: {link_url} -> {updated_url}')
        return f'[{link_text}]({updated_url})'
    elif os.path.commonpath([old_folder, link_url]) == old_folder:
        # Determine the new path relative to new_folder
        relative_path = os.path.relpath(link_url, old_folder)
        updated_url = os.path.relpath(os.path.join(new_folder, relative_path), base_url)
        print(f'Updated link: {link_url} -> {updated_url}')
        return f'[{link_text}]({updated_url})'
    else:
        # Leave the link unchanged
        return f'[{link_text}]({link_url_top})'

if __name__ == "__main__":
    folder_path = os.path.abspath(".")  # Replace with the folder containing your Markdown files
    old_folder = os.path.abspath("docs/build/core-contracts")  # Replace with the old folder path
    new_folder = os.path.abspath("docs/references/core-contracts")  # Replace with the new folder path

    update_markdown_links(folder_path, old_folder, new_folder)