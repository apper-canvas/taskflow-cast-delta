import commentsData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let comments = [...commentsData];

const commentService = {
  async getAll() {
    await delay(300);
    return [...comments];
  },

  async getById(id) {
    await delay(200);
    const comment = comments.find(c => c.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return { ...comment };
  },

  async getByTaskId(taskId) {
    await delay(300);
    return comments
      .filter(comment => comment.taskId === taskId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(comment => ({ ...comment }));
  },

  async create(commentData) {
    await delay(400);
    const newComment = {
      ...commentData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, commentData) {
    await delay(400);
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    
    const updatedComment = {
      ...comments[index],
      ...commentData,
      timestamp: new Date().toISOString()
    };
    comments[index] = updatedComment;
    return { ...updatedComment };
  },

  async delete(id) {
    await delay(300);
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    comments.splice(index, 1);
    return true;
  }
};

export default commentService;