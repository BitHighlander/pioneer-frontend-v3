import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { PioneerProvider } from 'web/context/Pioneer';
import Layout from 'web/layout';
import Routings from 'web/router/Routings';
import { theme } from 'web/styles/theme';

const App = () => (
  <ChakraProvider theme={theme}>
    <PioneerProvider>
      <Router>
        <Layout>
          <Routings />
        </Layout>
      </Router>
    </PioneerProvider>
  </ChakraProvider>
);

export default App;
