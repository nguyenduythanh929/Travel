import React, { useState, useEffect } from "react";

// Simple Star Rating Modal
const SimpleRatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialRating,
  isUpdate,
}: any) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating || 0);
    }
  }, [isOpen, initialRating]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating);
      onClose();
    } catch (err) {
      alert("Không thể gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-[320px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {isUpdate ? "Cập nhật đánh giá" : "Đánh giá tour"}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-red-500 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              disabled={isSubmitting}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={`w-10 h-10 ${
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                } transition-colors`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        {/* Rating Display */}
        {rating > 0 && (
          <p className="text-center text-gray-600 mb-6">
            Bạn đã chọn:{" "}
            <span className="font-bold text-yellow-500">{rating}</span> sao
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Thoát
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : isUpdate ? "Cập nhật" : "Đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo Component
interface RatingModelProps {
  bookingStatus: number;
  tourId: number;
  userId: string;
}

const RatingModel = ({ bookingStatus, tourId, userId }: RatingModelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isCompleted = bookingStatus === 2; // Only allow rating when booking is COMPLETED (status = 2)

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!isCompleted) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8088/api/reviews/tour/${tourId}/user/${userId}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setExistingReview(data);
        }
      } catch (error) {
        // No existing review, that's fine
        console.log("No existing review found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingReview();
  }, [tourId, userId, isCompleted]);

  const handleSubmitRating = async (rating: any) => {
    try {
      const isUpdate = !!existingReview;
      const url = isUpdate
        ? `http://localhost:8088/api/reviews/${existingReview.id}`
        : `http://localhost:8088/api/reviews`;

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tour_id: tourId,
          user_id: parseInt(userId),
          rating,
          comment: existingReview?.comment || "",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to submit rating";

        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }

        throw new Error(errorMessage);
      }

      const updatedReview = await response.json();
      setExistingReview(updatedReview);

      console.log("Rating submitted:", rating);
      alert(
        isUpdate
          ? `Đã cập nhật đánh giá ${rating} sao!`
          : `Cảm ơn bạn đã đánh giá ${rating} sao!`
      );
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      alert(error.message || "Không thể gửi đánh giá. Vui lòng thử lại!");
    }
  };

  // If booking is not completed, show disabled button with tooltip
  if (!isCompleted) {
    return (
      <div
        className="flex items-center justify-center p-4"
        title="Chỉ có thể đánh giá khi tour đã hoàn thành"
      >
        <button
          disabled
          className="px-3 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium opacity-50"
        >
          ⭐
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <button
          disabled
          className="px-3 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-wait font-medium"
        >
          ⭐
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className={`px-3 py-3 rounded-lg transition font-medium ${
          existingReview
            ? "bg-green-200 hover:bg-green-300"
            : "bg-yellow-200 hover:bg-yellow-300"
        }`}
        title={
          existingReview
            ? `Đã đánh giá ${existingReview.rating} sao`
            : "Đánh giá tour"
        }
      >
        {existingReview ? `⭐ ${existingReview.rating}` : "⭐"}
      </button>

      <SimpleRatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRating}
        initialRating={existingReview?.rating || 0}
        isUpdate={!!existingReview}
      />
    </div>
  );
};

export default RatingModel;
