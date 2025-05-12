// src/components/FeedPage.tsx
import CreatePost from "./CreatePost";
import PublicPosts from "./GetPosts";

const FeedPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold text-center text-teal-800">Social Feed</h1>

      {/* Create Post Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <CreatePost />
      </section>

      {/* Public Posts Section */}
      <section>
        <PublicPosts />
      </section>
    </div>
  );
};

export default FeedPage;
