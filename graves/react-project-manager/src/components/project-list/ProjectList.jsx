import React from 'react';

import ProjectSummary from '../project-summary/ProjectSummary';

const ProjectList = ({ projects }) => {
  return (
    <div className='section'>
      {projects &&
        projects.map((project, index) => <ProjectSummary project={project} key={index} />)}
    </div>
  );
};

export default ProjectList;
