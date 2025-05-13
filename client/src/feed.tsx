// // src/components/FeedPage.tsx
// import CreatePost from "./CreatePost";
// import PublicPosts from "./GetPosts";

// const FeedPage = () => {
//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
//       <h1 className="text-3xl font-bold text-center text-teal-800">Social Feed</h1>

//       {/* Create Post Section */}
//       <section className="bg-white p-6 rounded-lg shadow-md">
//         <CreatePost />
//       </section>

//       {/* Public Posts Section */}
//       <section>
//         <PublicPosts />
//       </section>
//     </div>
//   );
// };

// export default FeedPage;

// src/components/FeedPage.tsx
import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import PublicPosts from "./GetPosts";


const FeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/feed/getfeeds`);
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold text-center text-teal-800">Social Feed</h1>

      {/* Create Post Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <CreatePost setPosts={setPosts} />
      </section>

      {/* Public Posts Section */}
      <section>
        <PublicPosts posts={posts} setPosts={setPosts} loading={loading} />
      </section>
    </div>
  );
};

export default FeedPage;
