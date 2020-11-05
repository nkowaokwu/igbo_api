import { useRef, useEffect } from 'react';

const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (isSupported) {
      const eventListener = (event) => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      return (() => {
        element.removeEventListener(eventName, eventListener);
      });
    }
    return null;
  }, [eventName, element]);
};

export default useEventListener;
