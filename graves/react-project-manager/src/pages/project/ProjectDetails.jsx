import React from 'react';

const ProjectDetails = (props) => {
  const id = props.match.params.id;

  return (
    <div className='container section'>
      <div className='card blue-grey darken-1'>
        <div className='card-content'>
          <span className='card-title'>Project title - {id} </span>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et cum perspiciatis officia
            autem aliquam laborum, reprehenderit repellendus beatae animi molestias repellat neque
            atque adipisci vero. Illum, tempore quibusdam. Alias, commodi.
          </p>
        </div>
        <div className='card-action'>
          <p>Author</p>
          <p>Date 48987 </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
