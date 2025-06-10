import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import LoadingState from '@/components/organisms/LoadingState';
import EmptyState from '@/components/organisms/EmptyState';
import searchService from '@/services/api/searchService';
import projectService from '@/services/api/projectService';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchStats, setSearchStats] = useState({
    total: 0,
    searchTime: 0
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    project: 'all'
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setSearchStats({ total: 0, searchTime: 0 });
    }
  }, [query, filters]);

  const loadProjects = async () => {
    try {
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchOptions = {
        type: filters.type,
        limit: 100
      };
      
      const searchResults = await searchService.search(query, searchOptions);
      
      // Apply additional filters
      let filteredResults = searchResults.results;
      
      if (filters.status !== 'all') {
        filteredResults = filteredResults.filter(result => result.status === filters.status);
      }
      
      if (filters.priority !== 'all') {
        filteredResults = filteredResults.filter(result => result.priority === filters.priority);
      }
      
      if (filters.project !== 'all') {
        filteredResults = filteredResults.filter(result => result.projectId === filters.project);
      }
      
      setResults(filteredResults);
      setSearchStats({
        total: filteredResults.length,
        searchTime: searchResults.searchTime
      });
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setSearchStats({ total: 0, searchTime: 0 });
    }
    setLoading(false);
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };

  const highlightText = (text, query) => {
    if (!query.trim() || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-surface-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const navigateToItem = (result) => {
    if (result.type === 'task') {
      // Navigate to project board with task highlighted
      navigate(`/projects/${result.projectId}/board?highlight=${result.id}`);
    } else if (result.type === 'project') {
      navigate(`/projects/${result.id}/dashboard`);
    }
  };

  const handleNewSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      project: 'all'
    });
  };

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'task', label: 'Tasks Only' },
    { value: 'project', label: 'Projects Only' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.title }))
  ];

  const areFiltersActive = filters.type !== 'all' || filters.status !== 'all' || 
                          filters.priority !== 'all' || filters.project !== 'all';

  if (!query.trim()) {
    return (
      <div className="flex-1 flex flex-col bg-surface-50 min-h-0">
        <div className="bg-white border-b border-surface-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-surface-900">Search</h1>
          <p className="text-surface-600 mt-1">Enter a search term to find tasks, projects, and more</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            iconName="Search"
            title="Start searching"
            message="Use the search bar above to find tasks, projects, or comments"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-50 min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Search Results</h1>
            <p className="text-surface-600 mt-1">
              {loading ? 'Searching...' : (
                <>
                  {searchStats.total} results for "{query}" 
                  {searchStats.searchTime > 0 && (
                    <span className="text-surface-400"> ({searchStats.searchTime}ms)</span>
                  )}
                </>
              )}
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-surface-200 px-6 py-3">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-surface-700">Filter by:</span>
          
          <Select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            options={typeOptions}
            className="w-32"
          />
          
          <Select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
            className="w-32"
          />
          
          <Select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            options={priorityOptions}
            className="w-32"
          />
          
          <Select
            value={filters.project}
            onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
            options={projectOptions}
            className="w-40"
          />

          {areFiltersActive && (
            <Button
              variant="text"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingState message="Searching..." />
        ) : results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <EmptyState
              iconName="Search"
              title="No results found"
              message={`No results found for "${query}". Try adjusting your search terms or filters.`}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.type}-${result.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-surface-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToItem(result)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      result.type === 'task' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <ApperIcon 
                        name={result.type === 'task' ? 'CheckSquare' : 'Folder'} 
                        size={20}
                        className={result.type === 'task' ? 'text-blue-600' : 'text-green-600'}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-surface-900 break-words">
                            {highlightText(result.title, query)}
                          </h3>
                          
                          {result.snippet && (
                            <p className="text-surface-600 mt-2 break-words">
                              {highlightText(result.snippet, query)}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-surface-500">
                            <span className="capitalize">{result.type}</span>
                            {result.matchType && (
                              <>
                                <span>•</span>
                                <span>Match in {result.matchType}</span>
                              </>
                            )}
                            {result.projectId && result.type === 'task' && (
                              <>
                                <span>•</span>
                                <span>{getProjectName(result.projectId)}</span>
                              </>
                            )}
                            {result.updatedAt && (
                              <>
                                <span>•</span>
                                <span>Updated {format(new Date(result.updatedAt), 'MMM dd, yyyy')}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          {result.priority && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              result.priority === 'high' ? 'bg-red-100 text-red-700' :
                              result.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {result.priority}
                            </span>
                          )}
                          
                          {result.status && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              result.status === 'done' ? 'bg-green-100 text-green-700' :
                              result.status === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {result.status === 'inProgress' ? 'In Progress' : 
                               result.status === 'done' ? 'Done' : 'To Do'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;