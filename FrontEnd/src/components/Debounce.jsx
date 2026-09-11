import { useState, useEffect } from 'react';

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;




// debouce usage..

// useEffect(() => {
//   if (debouncedEmail) {
//     // Perform API call to check if email exists
//     console.log("Checking email:", debouncedEmail);
//   }
// }, [debouncedEmail]);