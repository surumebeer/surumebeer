#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const contentType = process.argv[2];

if (
  !contentType ||
  !["articles", "products", "css-tips"].includes(contentType)
) {
  console.error("Usage: node create-content.js <articles|products|css-tips>");
  process.exit(1);
}

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");

const dateDir = `${year}/${month}/${day}`;

let baseDir;

if (contentType === "products") {
  baseDir = path.join(process.cwd(), "content", contentType, "newProducts");
} else {
  baseDir = path.join(process.cwd(), "content", contentType, dateDir);
}

fs.mkdirSync(baseDir, { recursive: true });

let template;
let filename;

switch (contentType) {
  case "articles":
    filename = "article.md";
    template = `---
title: ""
date: ${year}-${month}-${day}
isPublished: false
tags: []
---

`;
    break;

  case "products":
    filename = "article.md";
    template = `---
title: ""
images: ""
description: ""
date: ${year}-${month}-${day}
isPublished: false
---

`;
    break;

  case "css-tips":
    filename = "article.md";
    template = `---
title: ""
date: ${year}-${month}-${day}
isPublished: false
---

`;
    break;
}

const filePath = path.join(baseDir, filename);
fs.writeFileSync(filePath, template);

console.log(`✅ Created ${contentType} template: ${filePath}`);
