import { useCallback, useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const ScrollFeed = ({ children, className = "", style = {} }) => {
  const containerRef = useRef(null);
  const isAutoScrollActiveRef = useRef(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight <= 100;
    
    isAutoScrollActiveRef.current = isAtBottom;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior,
    });
    isAutoScrollActiveRef.current = true;
    setShowScrollBottom(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      if (isAutoScrollActiveRef.current) {
        scrollToBottom("smooth");
      }
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={className}
        style={{ overflowY: "auto", width: "100%", height: "100%", ...style }}
      >
        {children}
      </div>

      {showScrollBottom && (
        <button
          type="button"
          aria-label="Scroll to latest messages"
          title="Scroll to latest messages"
          onClick={() => scrollToBottom("smooth")}
          style={{
            position: "absolute",
            right: "16px",
            bottom: "16px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            padding: 0,
            border: "none",
            borderRadius: "50%",
            backgroundColor: "#38B2AC",
            color: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
          }}
        >
          <IoIosArrowDown size={24} />
        </button>
      )}
    </div>
  );
};

export default ScrollFeed;