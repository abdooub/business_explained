import os

ga_tag = '''<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TJGKN1RB7E"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-TJGKN1RB7E');
</script>
'''

def add_ga_to_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if GA tag already exists
    if 'googletagmanager.com/gtag' in content:
        print(f"Skipping {file_path} - Google Analytics already present")
        return False
    
    # Insert GA tag after <head>
    if '<head>' in content:
        new_content = content.replace('<head>', f'<head>\n{ga_tag}', 1)
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Added Google Analytics to {file_path}")
        return True
    else:
        print(f"Warning: Could not find <head> tag in {file_path}")
        return False

def main():
    directory = os.path.dirname(os.path.abspath(__file__))
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    
    updated_count = 0
    for filename in html_files:
        file_path = os.path.join(directory, filename)
        if add_ga_to_file(file_path):
            updated_count += 1
    
    print(f"\nProcessed {len(html_files)} HTML files. Updated {updated_count} files with Google Analytics.")

if __name__ == "__main__":
    main()
