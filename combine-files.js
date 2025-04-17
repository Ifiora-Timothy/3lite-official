const fs = require("fs");
const path = require("path");
const outDir = "./out";

// Combine all JS files
const jsContent = fs
  .readdirSync(outDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => fs.readFileSync(path.join(outDir, file), "utf8"))
  .join("\n");

fs.writeFileSync(path.join(outDir, "combined.js"), jsContent);

// Combine all CSS files
const cssContent = fs
  .readdirSync(outDir)
  .filter((file) => file.endsWith(".css"))
  .map((file) => fs.readFileSync(path.join(outDir, file), "utf8"))
  .join("\n");

fs.writeFileSync(path.join(outDir, "combined.css"), cssContent);

// Update the main HTML file to use combined files
let htmlContent = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
htmlContent = htmlContent.replace(/<link[^>]*>/g, "");
htmlContent = htmlContent.replace(/<script[^>]*><\/script>/g, "");
htmlContent = htmlContent.replace(
  "</head>",
  `
  <link rel="stylesheet" href="combined.css">
  <script src="combined.js"></script>
</head>`
);

fs.writeFileSync(path.join(outDir, "index.html"), htmlContent);

console.log("Files combined successfully!");
