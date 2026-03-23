import { useEffect, useState } from 'react';
import axios from 'axios';

const useOrgsSearch = (org, page) => {
  const [repos, setRepos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setRepos([]);
  }, [org]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `https://api.github.com/orgs/${org}/repos?page=${page}&per_page=10`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setRepos((prevRepos) => {
          return [...prevRepos, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
        // console.log(res.data);
      })
      .catch((error) => {
        setError(true);
        if (axios.isCancel(error)) {
          return;
        }
      });
    return () => cancel();
  }, [org, page]);

  return { repos, hasMore, loading, error };
};

export default useOrgsSearch;
