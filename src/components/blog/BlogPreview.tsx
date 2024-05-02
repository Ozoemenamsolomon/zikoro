import React from "react";

interface BlogPreviewProps {
  content: string | string[]; // Update content prop to accept either a single string or an array of strings
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ content }) => {
  return (
    <div className="blog-preview">
      {/* If content is an array, render each item in a separate div */}
      {Array.isArray(content) ? (
        content.map((item, index) => <div key={index} dangerouslySetInnerHTML={{ __html: item }} />)
      ) : (
        // If content is a single string, render it directly
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
};

export default BlogPreview;