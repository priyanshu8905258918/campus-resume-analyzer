import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { api } from '../services/api';

function Analyze({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // First get the history to find the latest resume ID
        console.log('Fetching history for user:', user.user_id);
        const history = await api.getHistory(user.user_id);
        console.log('History response:', history);
        
        if (history && history.length > 0) {
          // Get the most recent analysis
          const latestAnalysis = history[0];
          if (latestAnalysis.resume_id) {
            console.log('Fetching analysis for resume:', latestAnalysis.resume_id);
            const analysisResponse = await api.getAnalysis(latestAnalysis.resume_id);
            console.log('Analysis response:', analysisResponse);
            setAnalysis(analysisResponse);
          } else {
            setAnalysis(latestAnalysis);
          }
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError('Failed to fetch analysis. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.user_id) {
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analysis available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload a resume to get started with the analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resume Analysis
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detailed analysis of your resume
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Overall Score</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-primary-500 mr-2" />
                  <span className="text-2xl font-bold">{analysis.score || 0}/100</span>
                </div>
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Improvements</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {(analysis.improvements || []).map((improvement, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <ExclamationCircleIcon className="flex-shrink-0 h-5 w-5 text-yellow-400" />
                        <span className="ml-2 flex-1 w-0 truncate">{improvement}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Analyze; 