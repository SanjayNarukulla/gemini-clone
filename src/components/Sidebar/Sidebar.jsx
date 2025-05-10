import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const toggleSidebar = () => setExtended((prev) => !prev);

  const handleLoadPrompt = async (prompt) => {
    await onSent(prompt);
  };

  const bottomItems = [
    { icon: assets.question_icon, label: "Help" },
    { icon: assets.history_icon, label: "Activity" },
    { icon: assets.setting_icon, label: "Settings" },
  ];

  return (
    <div className="sidebar">
      {/* Top Section */}
      <div className="top">
        <img
          onClick={toggleSidebar}
          className="menu"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        <div onClick={newChat} className="new-chat">
          <img src={assets.plus_icon} alt="New Chat Icon" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {Array.isArray(prevPrompts) && prevPrompts.length > 0 ? (
              prevPrompts.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleLoadPrompt(item.prompt)} // assuming `item.prompt` contains the text you need
                  className="recent-entry"
                >
                  <img src={assets.message_icon} alt="Prompt Icon" />
                  <p>
                    {item.prompt && item.prompt.length > 25
                      ? item.prompt.slice(0, 25) + "..." // truncate the prompt if it's too long
                      : item.prompt}
                  </p>
                </div>
              ))
            ) : (
              <p>No recent prompts available</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="bottom">
        {bottomItems.map((item, index) => (
          <div key={index} className="bottom-item recent-entry">
            <img src={item.icon} alt={`${item.label} Icon`} />
            {extended && <p>{item.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
