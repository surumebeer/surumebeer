import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "surumebeer",
};

async function getProfile() {
  try {
    const readmePath = path.join(process.cwd(), "README.md");

    if (!fs.existsSync(readmePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(readmePath, "utf8");
    const processedContent = await remark().use(html).process(fileContent);

    return processedContent.toString();
  } catch (error) {
    console.error("Error reading README.md:", error);
    return null;
  }
}

export default async function HomePage() {
  const profileContent = await getProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      {profileContent ? (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: profileContent }}
        />
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          <p className="text-muted-foreground">
            プロフィール情報が見つかりません。
          </p>
        </div>
      )}
    </div>
  );
}
