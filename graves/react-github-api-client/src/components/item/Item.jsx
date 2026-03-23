import React, { useRef, forwardRef } from 'react';
import './item.scss';
import Modal from '../modal/Modal';

const Item = forwardRef((props, ref) => {
  const { repo } = props;

  const modalRef = useRef();

  function openModal() {
    modalRef.current.openModal();
    console.log(repo);
  }

  return (
    <div>
      <section className='item' ref={ref} onClick={openModal}>
        <header className='item-header'>
          <p className='name'>{repo.name}</p>
          <p className='description'>{repo.description}</p>
        </header>
        <main className='item-main'>
          <p className='property'>Open Issues : {repo.open_issues}</p>
          <p className='property'>Language : {repo.language}</p>
        </main>
        <footer className='item-footer'>
          <a href={repo.url}>{repo.url}</a>
        </footer>
      </section>
      <Modal ref={modalRef} repo={repo} />
    </div>
  );
});

export default Item;
