import React, { useEffect } from "react"

const WindowControls = ({ theme, setTheme }) => {
  const darkClick = () => {
    if (theme === "dark") return
    setTheme("dark")
  }

  const lightClick = () => {
    if (theme === "light") return
    setTheme("light")
  }

  useEffect(() => {
    const root = document.querySelector("#root")
    if (theme === "light") {
      root.style.background = "#333"
    } else {
      root.style.background = "#fff"
    }
  }, [theme])

  return (
    <div>
      <style>{`
        .window-controls__container {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .window-controls__button-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 30px;
          width: 180px;
          background: rgba(255, 255, 255, 0.799579);
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.06);
          border-radius: 15px;
          padding: 0 2px;
        }
        
        .window-controls__button-wrapper.light {
          background: #303438;
        }
        
        .window-controls__button {
          height: 26px;
          width: 90px;
          background: none;
          box-shadow: none;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-family: Inter, sans-serif;
          font-weight: bold;
          font-size: 12px;
          line-height: 12px;
          letter-spacing: 0.8px;
          color: #000000;
          mix-blend-mode: normal;
          opacity: 0.2;
        }
        
        .window-controls__button.selected {
          background: #ffffff;
          box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.2);
          color: #0a0a0a;
          opacity: 1;
        }
        
        .window-controls__button.light {
          background: #303438;
          color: rgba(255, 255, 255, 0.4);
          opacity: 0.5;
        }
        
        .window-controls__button.selected.light {
          background: #3d4247;
          color: #ffffff;
          opacity: 1;
        }
        
        `}</style>
      <div className="window-controls__container">
        <div className={`window-controls__button-wrapper ${theme}`}>
          <div
            className={`window-controls__button ${
              theme === "dark" && "selected"
            } ${theme}`}
            onClick={darkClick}
          >
            DARK UI
          </div>
          <div
            className={`window-controls__button ${
              theme === "light" && "selected"
            } ${theme}`}
            onClick={lightClick}
          >
            LIGHT UI
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindowControls
