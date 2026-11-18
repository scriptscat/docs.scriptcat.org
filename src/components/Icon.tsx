// Bundled replacement for `import { Icon } from "@iconify/react"`.
//
// The default @iconify/react entry fetches icon data from api.iconify.design
// after hydration, so icons are absent from the SSR'd HTML and only pop in once
// that request lands -- seconds of blank space on a slow connection. The
// /offline entry never touches the network: it renders whatever has been
// registered here, server-side included.
//
// Adding an icon: add the import and the REGISTRY row, then use it anywhere as
// <Icon icon="lucide:zap" />. An icon used without a row here renders blank.
import type { IconifyIcon } from "@iconify/react";
import { Icon as OfflineIcon, addIcon } from "@iconify/react/offline";

import lucideArrowRight from "@iconify-icons/lucide/arrow-right";
import lucideArrowUpRight from "@iconify-icons/lucide/arrow-up-right";
import lucideBadgeCheck from "@iconify-icons/lucide/badge-check";
import lucideBan from "@iconify-icons/lucide/ban";
import lucideBookOpen from "@iconify-icons/lucide/book-open";
import lucideBot from "@iconify-icons/lucide/bot";
import lucideBoxes from "@iconify-icons/lucide/boxes";
import lucideBug from "@iconify-icons/lucide/bug";
import lucideCalendarCheck from "@iconify-icons/lucide/calendar-check";
import lucideCheck from "@iconify-icons/lucide/check";
import lucideChevronDown from "@iconify-icons/lucide/chevron-down";
import lucideCircleAlert from "@iconify-icons/lucide/circle-alert";
import lucideCircleCheck from "@iconify-icons/lucide/circle-check";
import lucideCircleCheckBig from "@iconify-icons/lucide/circle-check-big";
import lucideCircleX from "@iconify-icons/lucide/circle-x";
import lucideClock from "@iconify-icons/lucide/clock";
import lucideCloud from "@iconify-icons/lucide/cloud";
import lucideCode from "@iconify-icons/lucide/code";
import lucideCompass from "@iconify-icons/lucide/compass";
import lucideCpu from "@iconify-icons/lucide/cpu";
import lucideDownload from "@iconify-icons/lucide/download";
import lucideEye from "@iconify-icons/lucide/eye";
import lucideFileCode from "@iconify-icons/lucide/file-code";
import lucideFlame from "@iconify-icons/lucide/flame";
import lucideGauge from "@iconify-icons/lucide/gauge";
import lucideGithub from "@iconify-icons/lucide/github";
import lucideGlobe from "@iconify-icons/lucide/globe";
import lucideHeart from "@iconify-icons/lucide/heart";
import lucideHeartHandshake from "@iconify-icons/lucide/heart-handshake";
import lucideHouse from "@iconify-icons/lucide/house";
import lucideInfo from "@iconify-icons/lucide/info";
import lucideKeyRound from "@iconify-icons/lucide/key-round";
import lucideLanguages from "@iconify-icons/lucide/languages";
import lucideLaptop from "@iconify-icons/lucide/laptop";
import lucideListChecks from "@iconify-icons/lucide/list-checks";
import lucideLock from "@iconify-icons/lucide/lock";
import lucideMenu from "@iconify-icons/lucide/menu";
import lucideMessageCircle from "@iconify-icons/lucide/message-circle";
import lucideMonitor from "@iconify-icons/lucide/monitor";
import lucideMoon from "@iconify-icons/lucide/moon";
import lucideMousePointerClick from "@iconify-icons/lucide/mouse-pointer-click";
import lucidePackage from "@iconify-icons/lucide/package";
import lucidePictureInPicture2 from "@iconify-icons/lucide/picture-in-picture-2";
import lucidePlay from "@iconify-icons/lucide/play";
import lucidePlug from "@iconify-icons/lucide/plug";
import lucidePlugZap from "@iconify-icons/lucide/plug-zap";
import lucidePlus from "@iconify-icons/lucide/plus";
import lucidePuzzle from "@iconify-icons/lucide/puzzle";
import lucideRefreshCw from "@iconify-icons/lucide/refresh-cw";
import lucideReplace from "@iconify-icons/lucide/replace";
import lucideRocket from "@iconify-icons/lucide/rocket";
import lucideScanLine from "@iconify-icons/lucide/scan-line";
import lucideSearch from "@iconify-icons/lucide/search";
import lucideShieldCheck from "@iconify-icons/lucide/shield-check";
import lucideShoppingCart from "@iconify-icons/lucide/shopping-cart";
import lucideSkipForward from "@iconify-icons/lucide/skip-forward";
import lucideSmartphone from "@iconify-icons/lucide/smartphone";
import lucideSmile from "@iconify-icons/lucide/smile";
import lucideSparkles from "@iconify-icons/lucide/sparkles";
import lucideSquareTerminal from "@iconify-icons/lucide/square-terminal";
import lucideStar from "@iconify-icons/lucide/star";
import lucideStore from "@iconify-icons/lucide/store";
import lucideSun from "@iconify-icons/lucide/sun";
import lucideTag from "@iconify-icons/lucide/tag";
import lucideTerminal from "@iconify-icons/lucide/terminal";
import lucideUsers from "@iconify-icons/lucide/users";
import lucideWandSparkles from "@iconify-icons/lucide/wand-sparkles";
import lucideWrench from "@iconify-icons/lucide/wrench";
import lucideX from "@iconify-icons/lucide/x";
import lucideZap from "@iconify-icons/lucide/zap";
import logosChrome from "@iconify-icons/logos/chrome";
import logosFirefox from "@iconify-icons/logos/firefox";
import logosMicrosoftEdge from "@iconify-icons/logos/microsoft-edge";
import mingcuteDiscordLine from "@iconify-icons/mingcute/discord-line";
import octiconStar16 from "@iconify-icons/octicon/star-16";

const REGISTRY: Array<[string, IconifyIcon]> = [
  ["lucide:arrow-right", lucideArrowRight],
  ["lucide:arrow-up-right", lucideArrowUpRight],
  ["lucide:badge-check", lucideBadgeCheck],
  ["lucide:ban", lucideBan],
  ["lucide:book-open", lucideBookOpen],
  ["lucide:bot", lucideBot],
  ["lucide:boxes", lucideBoxes],
  ["lucide:bug", lucideBug],
  ["lucide:calendar-check", lucideCalendarCheck],
  ["lucide:check", lucideCheck],
  ["lucide:chevron-down", lucideChevronDown],
  ["lucide:circle-alert", lucideCircleAlert],
  ["lucide:circle-check", lucideCircleCheck],
  ["lucide:circle-check-big", lucideCircleCheckBig],
  ["lucide:circle-x", lucideCircleX],
  ["lucide:clock", lucideClock],
  ["lucide:cloud", lucideCloud],
  ["lucide:code", lucideCode],
  ["lucide:compass", lucideCompass],
  ["lucide:cpu", lucideCpu],
  ["lucide:download", lucideDownload],
  ["lucide:eye", lucideEye],
  ["lucide:file-code", lucideFileCode],
  ["lucide:flame", lucideFlame],
  ["lucide:gauge", lucideGauge],
  ["lucide:github", lucideGithub],
  ["lucide:globe", lucideGlobe],
  ["lucide:heart", lucideHeart],
  ["lucide:heart-handshake", lucideHeartHandshake],
  ["lucide:house", lucideHouse],
  ["lucide:info", lucideInfo],
  ["lucide:key-round", lucideKeyRound],
  ["lucide:languages", lucideLanguages],
  ["lucide:laptop", lucideLaptop],
  ["lucide:list-checks", lucideListChecks],
  ["lucide:lock", lucideLock],
  ["lucide:menu", lucideMenu],
  ["lucide:message-circle", lucideMessageCircle],
  ["lucide:monitor", lucideMonitor],
  ["lucide:moon", lucideMoon],
  ["lucide:mouse-pointer-click", lucideMousePointerClick],
  ["lucide:package", lucidePackage],
  ["lucide:picture-in-picture-2", lucidePictureInPicture2],
  ["lucide:play", lucidePlay],
  ["lucide:plug", lucidePlug],
  ["lucide:plug-zap", lucidePlugZap],
  ["lucide:plus", lucidePlus],
  ["lucide:puzzle", lucidePuzzle],
  ["lucide:refresh-cw", lucideRefreshCw],
  ["lucide:replace", lucideReplace],
  ["lucide:rocket", lucideRocket],
  ["lucide:scan-line", lucideScanLine],
  ["lucide:search", lucideSearch],
  ["lucide:shield-check", lucideShieldCheck],
  ["lucide:shopping-cart", lucideShoppingCart],
  ["lucide:skip-forward", lucideSkipForward],
  ["lucide:smartphone", lucideSmartphone],
  ["lucide:smile", lucideSmile],
  ["lucide:sparkles", lucideSparkles],
  ["lucide:square-terminal", lucideSquareTerminal],
  ["lucide:star", lucideStar],
  ["lucide:store", lucideStore],
  ["lucide:sun", lucideSun],
  ["lucide:tag", lucideTag],
  ["lucide:terminal", lucideTerminal],
  ["lucide:users", lucideUsers],
  ["lucide:wand-sparkles", lucideWandSparkles],
  ["lucide:wrench", lucideWrench],
  ["lucide:x", lucideX],
  ["lucide:zap", lucideZap],
  ["logos:chrome", logosChrome],
  ["logos:firefox", logosFirefox],
  ["logos:microsoft-edge", logosMicrosoftEdge],
  ["mingcute:discord-line", mingcuteDiscordLine],
  ["octicon:star-16", octiconStar16],
];

for (const [name, data] of REGISTRY) addIcon(name, data);

export const Icon = OfflineIcon;
export { InlineIcon } from "@iconify/react/offline";
