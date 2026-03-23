import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import './modal.scss';

const Modal = forwardRef((props, ref) => {
  const { repo } = props;

  const [display, setDisplay] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      openModal: () => open(),
      closeModal: () => close(),
    };
  });

  function open() {
    setDisplay(true);
    document.body.style.overflow = 'hidden';
    console.log('Modal opened');
  }

  function close() {
    setDisplay(false);
    document.body.style.overflow = 'unset';
    console.log('Modal closed');
  }

  if (display) {
    return ReactDOM.createPortal(
      <div className='modal-wrapper'>
        <div className='modal-backdrop' />
        <section className='modal-box'>
          <header className='modal-header'>
            <div className='top'>
              <p className='heading'>{repo.full_name}</p>
              <button className='close-button' onClick={close}>
                Close
              </button>
            </div>
            <div className='sub-heading-container'>
              <p className='sub-heading'>Owned by : {repo.owner.login} </p>
              {repo.license && <p className='sub-heading'>License : {repo.license.name} </p>}
            </div>
          </header>
          <main className='modal-main'>
            <p className='property'>Description : {repo.description}</p>
            <p className='property'>Pushed at : {repo.pushed_at}</p>
            <p className='property'>Id : {repo.id}</p>
            <p className='property'>Size : {repo.size} KB</p>
            <p className='property'>Default Branch : {repo.default_branch}</p>
            <p className='property'>Forks : {repo.forks}</p>
            <p className='property'>Language : {repo.language}</p>
            <p className='property'>Stargazers : {repo.stargazers_count}</p>
            <p className='property'>Watchers : {repo.watchers}</p>
          </main>
          <footer className='modal-footer'>
            <div className={`permission ${repo.permissions.admin.toString()}`}>Admin</div>
            <div className={`permission ${repo.permissions.pull.toString()}`}>Pull</div>
            <div className={`permission ${repo.permissions.push.toString()}`}>Push</div>
          </footer>
        </section>
      </div>,
      document.getElementById('modal-root')
    );
  } else {
    return null;
  }
});

export default Modal;
