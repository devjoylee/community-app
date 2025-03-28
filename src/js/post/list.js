import { dateFormatter } from '../utils/dateFormatter.js';
import { PostAPI } from '/src/api/postAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  displayPosts();
});

const displayPosts = async () => {
  const postsContainer = document.querySelector('.posts');
  const posts = await PostAPI.getAll();

  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="no-posts">등록된 게시글이 없습니다.</p>';
    return;
  }

  posts.forEach((post) => {
    const postBox = document.createElement('div');
    postBox.className = 'post-box';
    postBox.dataset.postId = post.id;

    const formattedDate = dateFormatter(new Date(post.createdAt));

    postBox.innerHTML = `
      <a href="pages/post/detail.html?id=${post.id}">
        <div class="box-header">
          <h1>${post.title}</h1>
          <ul class="post-info">
            <li>좋아요 <span>${post.likes}</span></li>
            <li>댓글 <span>${post.commentCount}</span></li>
            <li>조회수 <span>${post.views}</span></li>
            <li>${formattedDate}</li>
          </ul>
        </div>
        <div class="box-footer">
          <img src="${post.authorProfile}" alt="${post.author}" />
          <span>${post.author}</span>
        </div>
      </a>
    `;

    postsContainer.appendChild(postBox);
  });
};
