import React from 'react';
import { blogs } from './blogData';
import BlogCard from './BlogCard';

export default function Blogs() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">GregMat Blog</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((item) => (
          <BlogCard key={item.id} blog={item} />
        ))}
      </div>
    </div>
  );
}
