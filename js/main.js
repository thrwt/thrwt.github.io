const postsDiv = document.getElementById('posts');

// مثال: في مشروع حقيقي هتستخدم fetch أو مكتبة لتحميل ملفات md
const posts = [
  { title: "First Writeup", content: "This is an example writeup for Hacker Blog." }
];

posts.forEach(post => {
  const postEl = document.createElement('div');
  postEl.className = 'post';
  postEl.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
  postsDiv.appendChild(postEl);
});
