import useSWR from 'swr';

const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init);

  return res.json();
};

const useApi = (limit: number, page: number) => {
  const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`;

  const { data, error } = useSWR(url, fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error
  };
};

export default useApi;
