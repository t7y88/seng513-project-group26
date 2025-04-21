export function renderStarRating(rating) {
    return [1, 2, 3, 4, 5].map((i) => {
      if (rating >= i) return "★";         // full star
      if (rating >= i - 0.5) return "⯪";    // half star (optional symbol)
      return "☆";                           // empty star
    });
  }
  