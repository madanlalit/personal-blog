---
# ============================================
# BLOG POST TEMPLATE
# ============================================
# Copy this file and rename it to: YYYY-MM-DD-your-post-slug.md
# Example: 2025-12-18-my-first-post.md
#
# The filename determines:
#   - Date ordering (if you don't specify date in frontmatter)
#   - URL slug: /post/your-post-slug
# ============================================

# REQUIRED FIELDS
title: "Your Post Title Here"
date: "2025-12-18"                    # Format: YYYY-MM-DD
category: "Technology"                # Examples: Technology, Life, Ideas, Journal
excerpt: "A brief 1-2 sentence summary that appears in post listings and SEO meta tags."

# OPTIONAL FIELDS
subtitle: "An optional subtitle shown below the title"
readTime: 5                           # Minutes to read (auto-calculated if omitted)
tags: ["Tag1", "Tag2", "Tag3"]        # Array of tags for filtering

---

# Your Main Heading

Start writing your content here using **Markdown** syntax.

## Subheading

Regular paragraphs are just plain text. You can use *italics*, **bold**, or `inline code`.

### Lists

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item
2. Another item

### Blockquotes

> "This is a blockquote. Great for quotes or callouts."
> — Author Name

### Code Blocks

```javascript
// Code blocks with syntax highlighting
function hello() {
    console.log("Hello, World!");
}
```

### Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |

### Links and Images

[Link text](https://example.com)

![Image alt text](/path/to/image.jpg)

---

## After Creating Your Post

1. Save this file with your content
2. Run `npm run dev` or `npm run build`
3. Your post will appear automatically!

The URL will be: `/post/your-post-slug` (based on filename)
