import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { HeaderMenu } from './Components/HeaderMenu/HeaderMenu';
import { SeatingPage } from './Pages/SeatingPage';

function App() {
  return (
    <MantineProvider>
    
      
      <SeatingPage />
    
    </MantineProvider>);
}

export default App
