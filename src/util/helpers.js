export const submitAlternativeLike = (currentPost, user, setCurrentPost) => {
  if (currentPost.likes.find((like) => like.username === user.username)) {
    let newCount = currentPost.likeCount - 1;
    let newLikes = currentPost.likes.filter(
      (like) => like.username !== user.username
    );
    setCurrentPost({ ...currentPost, likeCount: newCount, likes: newLikes });
  } else {
    let newCount = currentPost.likeCount + 1;
    let newLikes = [...currentPost.likes, { username: user.username }];
    setCurrentPost({ ...currentPost, likeCount: newCount, likes: newLikes });
  }
};
