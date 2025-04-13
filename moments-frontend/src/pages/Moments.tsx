import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Moment = {
  _id: string;
  image: string;
  comment: string;
  tags: string[];
  createdAt: string;
};

export default function Moments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState("");
  const token = localStorage.getItem("token");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const fetchMoments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/moments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoments(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch moments");
      if (error.status === 401) navigate("/");
    }
  };

  useEffect(() => {
    fetchMoments();
  }, [token]);

  const handleAddMoment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !comment || !tags) {
      return toast.error("Please fill all fields");
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("comment", comment);
    formData.append("tags", tags);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/moments",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        toast.success("Moment added successfully!");
        setShowModal(false);
        setImage(null);
        setComment("");
        setTags("");
        fetchMoments(); // refresh the list
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error while adding moment"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Moments</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Moment
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {moments.length === 0 ? (
        <p className="text-gray-600 text-center">No moments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {moments.map((moment) => (
            <div key={moment._id} className="bg-white rounded shadow-md p-4">
              <img
                src={`http://localhost:5000/${moment.image.replace(
                  /\\/g,
                  "/"
                )}`}
                alt="Moment"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <p className="text-gray-800 mb-2">{moment.comment}</p>
              <div className="flex flex-wrap gap-2 text-sm text-blue-600 mb-2">
                {moment.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(moment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Moment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Moment</h2>
            <form onSubmit={handleAddMoment} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full"
              />
              <input
                type="text"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
