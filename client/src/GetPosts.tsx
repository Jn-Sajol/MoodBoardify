import { useEffect, useState } from "react";

const PublicPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
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

    fetchPosts();
  }, []);

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const token = localStorage.getItem("token");
    const content = commentInputs[postId]?.trim();

    if (!content || !token) return;

    setCommentLoading((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/feed/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, data.comment] }
              : post
          )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Public Posts</h2>

      {posts.length === 0 && <p className="text-center text-gray-500">No posts available</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">{post.user?.name}</h3>
            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full uppercase tracking-wide">
              {post.mood}
            </span>
          </div>

          <p className="text-gray-900 mb-3">{post.message}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>

          {/* Comments */}
          {post.comments?.length > 0 && (
            <div className="mt-5 border-t pt-3">
              <h4 className="text-sm font-medium mb-2 text-gray-700">Comments:</h4>
              <div className="space-y-2">
                {post.comments.map((c: any) => (
                  <div key={c.id} className="text-sm text-gray-700">
                    <span className="font-semibold">{c.user?.name}:</span> {c.content}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment */}
          <div className="mt-4">
            <input
              type="text"
              value={commentInputs[post.id] || ""}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => handleCommentSubmit(post.id)}
              disabled={commentLoading[post.id]}
              className={`mt-2 px-4 py-2 rounded-md text-sm bg-gradient-to-r from-teal-800 to-teal-600 text-white hover:from-blue-400 hover:to-blue-900 cursor-pointer ${
                commentLoading[post.id]
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {commentLoading[post.id] ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicPosts;
