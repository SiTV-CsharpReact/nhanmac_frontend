import React from "react";

const ViewArticle = (post: any) => {
  console.log(post);
  return (
    <>
      <section
        className="prose max-w-none max-h-[700px] p-6 overflow-y-auto"
        dangerouslySetInnerHTML={{
          __html: post.data,
        }}
      />
    </>
  );
};

export default ViewArticle;
