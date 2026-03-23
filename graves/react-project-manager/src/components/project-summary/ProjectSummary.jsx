import React from 'react';

const ProjectSummary = ({ project }) => {
  return (
    <div className='card blue-grey darken-1'>
      <div className='card-content  white-text'>
        <span className='card-title'>
          {project.title} - {project.id}
        </span>
        <p>Posted by THis man</p>
        <p>19 july 2020</p>
      </div>
    </div>
  );
};

export default ProjectSummary;
