import React, { useState } from 'react';

const CreateProject = () => {
  const [details, setDetails] = useState({
    title: '',
    content: '',
  });

  const handleChange = (name) => (e) => {
    setDetails({ ...details, [name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(details);
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h4 className='grey-text text-darken-3'>Create new Project</h4>
        <div className='input-field'>
          <label htmlFor='title'>Title</label>
          <input onChange={handleChange('title')} type='text' id='title' />
        </div>
        <div className='input-field'>
          <label htmlFor='content'>Project Content</label>
          <textarea
            className='materialize-textarea'
            onChange={handleChange('title')}
            id='content'
          ></textarea>
        </div>
        <div className='input-field'>
          <button className='btn orange darken-1'>Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
