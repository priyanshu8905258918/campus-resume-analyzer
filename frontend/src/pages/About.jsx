import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            About Campus Resume Analyzer
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Campus Resume Analyzer is a student-first tool built by and for our college warriors.
              It's designed to help you crush internships, placements, and off-campus dreams.
            </p>
          </div>
          <div className="mt-5">
            <div className="rounded-md bg-primary-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HeartIcon className="h-5 w-5 text-primary-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-800">
                    Built with ❤️ and madness
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 