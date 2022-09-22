#!/usr/bin/env bash
#
# Custom linting for the ui package.
#

# cd to packages/ui
cd "$( dirname "${BASH_SOURCE[0]}" )"/..

function report_problem_file() {
  local files=${1}
  local header=${2}
  local footer=${3}
  if [[ -n "${files}" ]] ; then
    cat << EOT
${header}
$(sed 's/^/- /g' <<<"${files}")

${footer}
EOT
    exit 1
  fi
}

# Find any files defined directly in the src directory.
files_in_src=$(find src -type f -maxdepth 1)
report_problem_file "${files_in_src}" \
  "The following files are in the src directory:" \
  "To fix, please move them to somewhere else."

# Find any files defined directly in the src components.
files_in_component=$(find src/components -type f -maxdepth 1)
report_problem_file "${files_in_component}" \
  "The following files are in the component directory:" \
  "To fix, please move them to into a component subdirectory."

# Detect pages that are uppercase. This often will catch components defined in
# the pages directory that should not be there.
uppercase_pages=$(find src/pages -type f | grep -E '[A-Z]')
report_problem_file "${uppercase_pages}" \
  "The following files are components defined in the pages directory:" \
  "To fix, please move them to the components directory."

# Detect any newly added JavaScript files.
current_js_files="src/components/atoms/Link.js
src/components/atoms/MonogramIcon.js
src/components/atoms/Wordmark.js
src/components/atoms/passes/CreatePass.js
src/components/messages/ChecklistTasks.js
src/components/messages/assets/ChannelInfoIcon.js
src/components/messages/assets/ChannelSaveIcon.js
src/components/messages/assets/CloseThreadIcon.js
src/components/messages/assets/CommandIcon.js
src/components/messages/assets/CreateChannelIcon.js
src/components/messages/assets/EmojiIcon.js
src/components/messages/assets/HamburgerIcon.js
src/components/messages/assets/LightningBoltSmall.js
src/components/messages/assets/SendIcon.js
src/components/messages/assets/XButton.js
src/components/messages/assets/XButtonBackground.js
src/components/messages/assets/index.js
src/components/messages/components/ChannelInner/ChannelInner.js
src/components/messages/components/CustomMessage/CustomMessage.js
src/components/messages/components/CustomSearchInput/Custom-dropdown.js
src/components/messages/components/MessagingChannelHeader/MessagingChannelHeader.js
src/components/messages/components/MessagingChannelList/MessagingChannelList.js
src/components/messages/components/MessagingChannelList/SkeletonLoader.js
src/components/messages/components/MessagingChannelPreview/MessagingChannelPreview.js
src/components/messages/components/MessagingInput/MessagingInput.js
src/components/messages/components/MessagingInput/MessagingInputFanPerspective.js
src/components/messages/components/MessagingThread/MessagingThread.js
src/components/messages/components/TypingIndicator/TypingIndicator.js
src/components/messages/components/WindowControls/WindowControls.js
src/components/messages/components/index.js
src/components/messages/index.js
src/components/molecules/Card.js
src/components/molecules/CardCarousel.js
src/components/molecules/CssGridTiles.js
src/components/molecules/Sidebar/SidebarButtons/BecomeCreatorButton.js
src/components/molecules/Sidebar/SidebarButtons/LogoutButton.js
src/components/molecules/Sidebar/SidebarButtons/MobileLogoutButton.js
src/components/molecules/Sidebar/SidebarButtons/index.js
src/components/molecules/Sidebar/SidebarLayout/CreatorToolsItem.js
src/components/molecules/Sidebar/SidebarLayout/CreatorToolsSidebar.js
src/components/molecules/Sidebar/SidebarLayout/MobileNavbar.js
src/components/molecules/Sidebar/SidebarLayout/SidebarContainer.js
src/components/molecules/Sidebar/SidebarLayout/SidebarHeader.js
src/components/molecules/Sidebar/SidebarLayout/SidebarItems.js
src/components/molecules/Sidebar/SidebarLayout/SidebarMobileContainer.js
src/components/molecules/Sidebar/SidebarLayout/SidebarMobileHeader.js
src/components/molecules/Sidebar/SidebarLayout/SidebarMobileItems.js
src/components/molecules/Sidebar/SidebarLayout/index.js
src/components/molecules/Sidebar/index.js
src/components/molecules/animated-heart.js
src/components/molecules/avatar/index.js
src/components/molecules/avatar/skeleton.js
src/components/molecules/background/grainy.js
src/components/molecules/drag-drop/Card.js
src/components/molecules/drag-drop/item-types.js
src/components/molecules/index.js
src/components/molecules/passes/CreatePass.js
src/components/molecules/passes/MyPasses.js
src/components/molecules/passes/index.js
src/components/organisms/Popover.js
src/components/organisms/ProfileNftPass/index.js
src/components/organisms/media-record/index.js
src/components/organisms/passes/CreatePass.js
src/components/organisms/passes/MyPasses.js
src/components/organisms/passes/index.js
src/components/organisms/payouts/index.js
src/components/organisms/sidebar/SidebarDefault/index.js
src/components/organisms/sidebar/SidebarMobile/index.js
src/components/organisms/sidebar/index.js
src/components/pages/Welcome.js
src/components/pages/profile/about-creator.js
src/components/pages/profile/header/index.js
src/components/pages/profile/main-content/index.js
src/components/pages/profile/main-content/new-post/audience-dropdown.js
src/components/pages/profile/main-content/new-post/footer.js
src/components/pages/profile/main-content/new-post/fundraiser-tab.js
src/components/pages/profile/main-content/new-post/index.js
src/components/pages/profile/main-content/new-post/navigation.js
src/components/pages/profile/main-content/new-post/polls-tab.js
src/components/pages/profile/main-content/news-feed/creator-content-feed.js
src/components/pages/profile/main-content/news-feed/events-feed.js
src/components/pages/profile/main-content/news-feed/fan-wall-feed.js
src/components/pages/profile/main-content/news-feed/news-feed-content.js
src/components/pages/profile/main-content/news-feed/passes-feed.js
src/components/pages/profile/main-content/news-feed/post-dropdown.js
src/components/pages/profile/main-content/news-feed/post.js
src/components/pages/profile/posts/post-card.js
src/components/pages/profile/profile-details/ProfileComponents.js
src/components/pages/profile/profile-details/edit-profile.js
src/components/pages/profile/profile-details/index.js
src/helpers/payment/ABI.js
src/helpers/payment/payment-wallet.jsx
src/icons/wallet-icon.js
src/layout/CreatorSearchBar/SearchDropdown/SearchResults.js
src/layout/CreatorSearchBar/SearchDropdown/index.js
src/layout/Sidebar/index.js
src/pages/home.js
src/pages/notification.js
src/pages/tools/earnings.js
src/pages/tools/manage-passes/create.js
src/pages/tools/payouts.js
src/pages/verification.jsx
src/providers/index.js
src/providers/theme-provider.js"
all_javascript_files=$(find src -type f -name '*.js*' | sort)
new_js_files=$(comm -13 <(echo "${current_js_files}") <(echo "${all_javascript_files}"))
report_problem_file "${new_js_files}" \
  "The following files are newly added JavaScript files:" \
  "To fix, please convert to Typescript."

echo "Success!"
