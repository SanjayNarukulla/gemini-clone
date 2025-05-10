import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import "./Main.css";
import { Context } from "../../context/Context";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const cardData = [
    {
      text: "Suggest beautiful places to see on an upcoming road trip",
      icon: assets.compass_icon,
    },
    {
      text: "Share innovative project ideas for developers",
      icon: assets.bulb_icon,
    },
    {
      text: "Help with technical queries and problem-solving",
      icon: assets.message_icon,
    },
    {
      text: "Provide coding tips and resources for learning",
      icon: assets.code_icon,
    },
  ];

  const handleSend = () => {
    if (input.trim()) {
      onSent(input);
    }
  };

  return (
    <div className="main">
      {/* Navigation */}
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>

      {/* Main Container */}
      <div className="main-container">
        {!showResult ? (
          <>
            {/* Greeting */}
            <div className="greet">
              <p>
                <span>Hello, Dev</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            {/* Cards */}
            <div className="cards">
              {cardData.map((card, index) => (
                <div
                  className="card"
                  key={index}
                  onClick={() => onSent(card.text)}
                >
                  <p>{card.text}</p>
                  <img src={card.icon} alt={`Card Icon ${index + 1}`} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            {/* User Prompt */}
            <div className="result-title">
              <img src={assets.user_icon} alt="User Icon" />
              <p>{recentPrompt}</p>
            </div>

            {/* Result Data */}
            <div className="result-data">
              <img src={assets.gemini_icon} alt="Gemini Icon" />
              {loading ? (
                <div className="animated-text result-text">{resultData}</div>
              ) : (
                <ReactMarkdown
                  children={resultData}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="result-text" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 className="result-header" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="result-header" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const language = className
                        ? className.replace("language-", "")
                        : "javascript";
                      return !inline ? (
                        <SyntaxHighlighter
                          language={language}
                          style={docco}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="Gallery Icon" />
              <img src={assets.mic_icon} alt="Mic Icon" />
              {input && (
                <img
                  onClick={handleSend}
                  src={assets.send_icon}
                  alt="Send Icon"
                />
              )}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
