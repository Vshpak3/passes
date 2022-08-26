import { Avatar } from "stream-chat-react"

export const CustomDropdown = (props) => {
  const { results, focusedUser, selectResult, SearchResultItem } = props

  let items = results.filter((x) => x.cid)
  let users = results.filter((x) => !x.cid)
  return (
    <div>
      <style>
        {`
        .channel-search__result-user {
          display: flex;
          align-items: center;
          margin-left: 12px;
        }

        .result-hashtag {
          margin: 12px;
          display: flex;
          justify-content: center;
          font-family: Helvetica Neue, sans-serif;
          font-weight: bold;
          color: #005fff;
        }

        .channel-search__result-text {
          width: 100%;
          font-family: Helvetica Neue, sans-serif;
          font-weight: 500;
          font-size: 14px;
          line-height: 120%;
          color: #2c2c30;
        }

        .user-online {
          color: red;
          font-size: 10px;
          padding-top: 2px;
          padding-left: 5px;
        }

        .channel-search-header {
          font-weight: 700;
          font-size: 16px;
        }`}
      </style>
      <p>Channels</p>
      {!items.length && <p>No Channels...</p>}
      {items.map((result, index) => (
        <SearchResultItem
          focusedUser={focusedUser}
          index={index}
          key={index}
          result={result}
          selectResult={selectResult}
        />
      ))}
      <p>Users</p>
      {!users.length && <p>No Users...</p>}
      {users.map((result, index) => (
        <SearchResultItem
          focusedUser={focusedUser}
          index={index}
          key={index}
          result={result}
          selectResult={selectResult}
        />
      ))}
    </div>
  )
}

const isChannel = (output) => output.cid != null

export const CustomResultItem = (props) => {
  const { focusedUser, index, result, selectResult } = props

  const focused = focusedUser === index

  if (isChannel(result)) {
    const channel = result
    const members = channel?.data?.member_count

    return (
      <div
        className={`str-chat__channel-search-result ${
          focused ? "focused" : ""
        }`}
        onClick={() => selectResult(result)}
      >
        <div className="result-hashtag">#</div>
        <p className="channel-search__result-text">
          {channel?.data?.name}, ({members} member{members === 1 ? "" : "s"})
        </p>
      </div>
    )
  } else {
    return (
      <div
        className={`str-chat__channel-search-result ${
          focused ? "focused" : ""
        }`}
        onClick={() => selectResult(result)}
      >
        <Avatar image="/img/backers/wenwen.png" />
        {result.name}
        {result.online && <p className="user-online"> Online Now!</p>}
      </div>
    )
  }
}

export const SearchResultsHeader = () => {
  return <div className="channel-search-header">So many search results!</div>
}
