import React from "react"

export const SkeletonLoader = () => {
  return (
    <div style={{ position: "relative" }}>
      <style>
        {`
        
.skeleton-loader__list {
  position: absolute;
  width: 260px;
  height: 100%;
  float: left;
  margin-top: 0;
  padding: 0;
  list-style: none;
}

@media screen and (max-width: 640px) {
  .skeleton-loader__list {
    width: unset;
  }
}

.skeleton-loader__list li {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.skeleton-loader__avatar,
.skeleton-loader__text {
  display: inline-block;
}

.skeleton-loader__avatar {
  float: left;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 100px;
}

.skeleton-loader__text div {
  width: 200px;
  height: 12px;
  border-radius: 20px;
}

.skeleton-loader__text div:nth-child(2) {
  height: 6px;
  margin-top: 8px;
}

.skeleton-loader__avatar,
.skeleton-loader__text div {
  animation: placeHolderShimmer 1.5s linear infinite;
  background: rgba(255, 255, 255, 0.2);
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 5%,
    rgba(0, 0, 0, 0.2) 25%,
    rgba(0, 0, 0, 0.25) 50%,
    rgba(0, 0, 0, 0.2) 75%,
    rgba(0, 0, 0, 0) 95%,
    rgba(0, 0, 0, 0) 100%
  );
  background-repeat: no-repeat;
  background-size: 400px 100%;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}`}
      </style>
      <ul className="skeleton-loader__list">
        <li>
          <div className="skeleton-loader__avatar"></div>
          <div className="skeleton-loader__text">
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className="skeleton-loader__avatar"></div>
          <div className="skeleton-loader__text">
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className="skeleton-loader__avatar"></div>
          <div className="skeleton-loader__text">
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className="skeleton-loader__avatar"></div>
          <div className="skeleton-loader__text">
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className="skeleton-loader__avatar"></div>
          <div className="skeleton-loader__text">
            <div></div>
            <div></div>
          </div>
        </li>
      </ul>
    </div>
  )
}
