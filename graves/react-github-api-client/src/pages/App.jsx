import React, { useState, useRef, useCallback } from 'react';
import useOrgsSearch from '../hooks/useOrgsSearch';
import Item from '../components/item/Item';
import './style.scss';
//import { Loading } from '../assets/Loading';

const App = () => {
  const [org, setOrg] = useState('octokit');
  const [page, setPage] = useState(1);

  const { repos, hasMore, loading, error } = useOrgsSearch(org, page);

  // console.log(repos);
  // console.log(hasMore);
  // console.log(loading);
  // console.log(error);

  const observer = useRef();
  const lastRepoRef = useCallback(
    (node) => {
      if (loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
      // console.log(node);
    },
    [loading, hasMore]
  );

  function handleSearch(event) {
    setOrg(event.target.value);
    setPage(1);
  }

  return (
    <div className='home'>
      <header className='home-header'>
        <input
          placeholder='Ex Octokit'
          className='search'
          type='text'
          value={org}
          onChange={handleSearch}
        />
        {/* <p className='loading'>{loading ? 'Loading...' : 'Loaded'}</p> */}
      </header>
      <main className='home-main'>
        {repos.map((repo, index) => {
          if (repos.length === index + 1) {
            return <Item ref={lastRepoRef} key={repo.id} repo={repo} />;
          } else {
            return <Item key={repo.id} repo={repo} />;
          }
        })}
      </main>
    </div>
  );
};

export default App;
