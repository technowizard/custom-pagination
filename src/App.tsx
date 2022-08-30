import { useState } from 'react';

import { Flex, Box, Container, Text, Spinner } from '@chakra-ui/react';

import Pagination from './components/pagination.component';

import useApi from './hooks/useApi';

const App = () => {
  const [pageCount, setPageCount] = useState(1);
  const [pageLimit] = useState(5);

  const { data, isLoading } = useApi(pageLimit, pageCount);

  return (
    <Container flexDirection="column" p={8}>
      <Box mb={8}>
        <Text fontWeight="bold">Custom Pagination Component</Text>
      </Box>
      {!isLoading ? (
        <Flex direction="column" justifyContent="center" gap={4}>
          {data.map((item: any, index: number) => (
            <>
              <Box>
                <Text fontWeight="semibold">
                  {`#${item.id} - ${item.title}`}
                </Text>
              </Box>
              <Box>
                <Text>{item.body}</Text>
              </Box>
            </>
          ))}
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center" minH="600px">
          <Spinner size="xl" />
        </Flex>
      )}
      <Flex justifyContent="center" mt={8}>
        <Pagination
          currentPage={pageCount}
          totalCount={100}
          pageSize={pageLimit}
          onPageChange={(page: number) => setPageCount(page)}
        />
      </Flex>
    </Container>
  );
};

export default App;
