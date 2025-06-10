import tasksData from '../mockData/tasks.json';
import projectsData from '../mockData/projects.json';
import commentsData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];
let projects = [...projectsData];
let comments = [...commentsData];

// Helper function to calculate relevance score
const calculateRelevance = (text, query) => {
  if (!text || !query) return 0;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match gets highest score
  if (lowerText === lowerQuery) return 100;
  
  // Title/word start match gets high score
  if (lowerText.startsWith(lowerQuery)) return 90;
  
  // Contains query as whole word gets medium-high score
  const wordBoundaryRegex = new RegExp(`\\b${lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  if (wordBoundaryRegex.test(lowerText)) return 70;
  
  // Contains query as substring gets medium score
  if (lowerText.includes(lowerQuery)) return 50;
  
  // Fuzzy matching for partial words
  const queryWords = lowerQuery.split(' ');
  let matchScore = 0;
  queryWords.forEach(word => {
    if (lowerText.includes(word)) {
      matchScore += 20;
    }
  });
  
  return Math.min(matchScore, 40);
};

// Helper function to get text snippet with highlighting context
const getSnippet = (text, query, maxLength = 150) => {
  if (!text || !query) return '';
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerText.indexOf(lowerQuery);
  
  if (queryIndex === -1) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  const start = Math.max(0, queryIndex - 50);
  const end = Math.min(text.length, queryIndex + query.length + 50);
  
  let snippet = text.substring(start, end);
  
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet;
};

const searchService = {
  async search(query, options = {}) {
    await delay(400);
    
    if (!query || query.trim().length === 0) {
      return {
        results: [],
        total: 0,
        query: query?.trim() || '',
        searchTime: 0
      };
    }
    
    const startTime = Date.now();
    const trimmedQuery = query.trim();
    const { limit = 50, offset = 0, type = 'all' } = options;
    
    let allResults = [];
    
    // Search tasks
    if (type === 'all' || type === 'task') {
      tasks.forEach(task => {
        let maxScore = 0;
        let bestMatch = '';
        let matchType = '';
        
        // Search title
        const titleScore = calculateRelevance(task.title, trimmedQuery);
        if (titleScore > maxScore) {
          maxScore = titleScore;
          bestMatch = getSnippet(task.title, trimmedQuery);
          matchType = 'title';
        }
        
        // Search description
        if (task.description) {
          const descScore = calculateRelevance(task.description, trimmedQuery);
          if (descScore > maxScore) {
            maxScore = descScore;
            bestMatch = getSnippet(task.description, trimmedQuery);
            matchType = 'description';
          }
        }
        
        // Search comments
        const taskComments = comments.filter(c => c.taskId === task.id);
        taskComments.forEach(comment => {
          const commentScore = calculateRelevance(comment.content, trimmedQuery) * 0.8; // Lower weight for comments
          if (commentScore > maxScore) {
            maxScore = commentScore;
            bestMatch = getSnippet(comment.content, trimmedQuery);
            matchType = 'comment';
          }
        });
        
        if (maxScore > 0) {
          allResults.push({
            id: task.id,
            type: 'task',
            title: task.title,
            description: task.description,
            snippet: bestMatch,
            matchType,
            score: maxScore,
            status: task.status,
            priority: task.priority,
            projectId: task.projectId,
            assignee: task.assignee,
            dueDate: task.dueDate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
          });
        }
      });
    }
    
    // Search projects (if needed)
    if (type === 'all' || type === 'project') {
      projects.forEach(project => {
        let maxScore = 0;
        let bestMatch = '';
        let matchType = '';
        
        // Search title
        const titleScore = calculateRelevance(project.title, trimmedQuery);
        if (titleScore > maxScore) {
          maxScore = titleScore;
          bestMatch = getSnippet(project.title, trimmedQuery);
          matchType = 'title';
        }
        
        // Search description
        if (project.description) {
          const descScore = calculateRelevance(project.description, trimmedQuery);
          if (descScore > maxScore) {
            maxScore = descScore;
            bestMatch = getSnippet(project.description, trimmedQuery);
            matchType = 'description';
          }
        }
        
        if (maxScore > 0) {
          allResults.push({
            id: project.id,
            type: 'project',
            title: project.title,
            description: project.description,
            snippet: bestMatch,
            matchType,
            score: maxScore,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            createdAt: project.createdAt
          });
        }
      });
    }
    
    // Sort by relevance score (descending) and then by recency
    allResults.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
    
    const total = allResults.length;
    const results = allResults.slice(offset, offset + limit);
    const searchTime = Date.now() - startTime;
    
    return {
      results,
      total,
      query: trimmedQuery,
      searchTime,
      hasMore: offset + limit < total
    };
  },

  async getAutocomplete(query, limit = 8) {
    await delay(200);
    
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const trimmedQuery = query.trim();
    let suggestions = [];
    
    // Get task suggestions
    tasks.forEach(task => {
      const titleScore = calculateRelevance(task.title, trimmedQuery);
      const descScore = task.description ? calculateRelevance(task.description, trimmedQuery) * 0.7 : 0;
      const maxScore = Math.max(titleScore, descScore);
      
      if (maxScore > 30) { // Threshold for autocomplete
        suggestions.push({
          id: task.id,
          type: 'task',
          title: task.title,
          description: task.description,
          score: maxScore,
          status: task.status,
          priority: task.priority,
          projectId: task.projectId
        });
      }
    });
    
    // Sort by score and limit results
    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.slice(0, limit);
  },

  async getRecentSearches() {
    await delay(100);
    // In a real app, this would come from localStorage or user preferences
    return [
      'high priority tasks',
      'overdue items',
      'project alpha',
      'in progress'
    ];
  }
};

export default searchService;